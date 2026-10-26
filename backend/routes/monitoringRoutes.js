import express from 'express';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import { protect, requireAdmin, requireSuperadmin } from '../middleware/authMiddleware.js';
import { WorkSession, MonitoringSession, MonitoringConsent, ActivityEvent, AdminNotification, AuditLog } from '../models/Monitoring.js';
import { employeeFor, checkIn, finalize, report } from '../services/monitoring.js';
import { deliverNotifications, sessionUpdated } from '../services/monitoringSocket.js';
const router = express.Router();
router.use(protect, rateLimit({ windowMs: 60000, limit: 120 }));
const fail = (message,status=400) => { throw Object.assign(new Error(message),{status}); };
const handle = fn => async (req,res,next) => { try { await fn(req,res); } catch(e) { res.status(e.status || (e.name==='ValidationError'||e.name==='CastError'?400:500)); next(e); } };
const ownWork = async req => {
  const employee = await employeeFor(req.user);
  const work = await WorkSession.findOne({ employee: employee._id, status: 'open' });
  if (!work) fail('Check in first',409);
  return { employee,work };
};
router.post('/attendance/check-in',handle(async(req,res)=>{
  const employee = await employeeFor(req.user);
  const work = await checkIn(employee,req.body.timezone || 'UTC');
  res.json(work);
}));
export const logoutHandler = handle(async(req,res)=>{
  if(req.user.role!=='employee') {
    if(req.path.includes('logout')) await User.updateOne({_id:req.user._id},{$inc:{tokenVersion:1}});
    return res.json({success:true});
  }
  const employee = await employeeFor(req.user);
  const work = await finalize(employee,req.body.sessionId,req.path.includes('logout')?'logout':'checkout');
  sessionUpdated(req.user._id,{status:'stopped'});
  if(req.path.includes('logout')) await User.updateOne({_id:req.user._id},{$inc:{tokenVersion:1}});
  await deliverNotifications().catch(e=>console.error('Outbox delivery deferred:',e.message));
  res.json(work || {success:true});
});
router.post('/attendance/check-out',logoutHandler);
router.post('/attendance/breaks',handle(async(req,res)=>{
  const {work}=await ownWork(req);
  if(!['start','end'].includes(req.body.action))fail('Break action must be start or end');
  await WorkSession.db.transaction(async session=>{
    const w=await WorkSession.findOneAndUpdate({_id:work._id,status:'open'},{$set:{reason:'break update'}},{new:true,session});
    if(!w)fail('Attendance ended',409);
    const last=w.breaks.at(-1);
    if(req.body.action==='start'&&(!last||last.end))w.breaks.push({start:new Date()});
    if(req.body.action==='end'&&last&&!last.end)last.end=new Date();
    await w.save({session});
  });res.json({success:true});
}));
router.get('/attendance/me/today',handle(async(req,res)=>{
  const employee = await employeeFor(req.user);
  res.json(await WorkSession.find({employee:employee._id,$or:[{status:'open'},{$expr:{$eq:[{$dateToString:{format:'%Y-%m-%d',date:'$checkIn',timezone:'$timezone'}},{$dateToString:{format:'%Y-%m-%d',date:new Date(),timezone:'$timezone'}}]}}]}).sort({checkIn:-1}).limit(10));
}));
router.post('/monitoring/consent',handle(async(req,res)=>{
  const employee = await employeeFor(req.user);
  if(req.body.withdraw) {
    await WorkSession.db.transaction(async session=>{
      const work = await WorkSession.findOneAndUpdate({employee:employee._id,status:'open'},{$set:{reason:'consent withdrawn'}},{session,new:true});
      await MonitoringConsent.updateMany({employee:employee._id,withdrawnAt:null},{$set:{withdrawnAt:new Date()}},{session});
      const monitors = await MonitoringSession.find({employee:employee._id,status:{$ne:'stopped'}}).session(session);
      for(const m of monitors){const now=new Date(); if(m.intervals.at(-1)&&!m.intervals.at(-1).end)m.intervals.at(-1).end=now;m.stop=now;m.status='stopped';await m.save({session});}
      void work;
    });
    sessionUpdated(req.user._id,{status:'stopped'}); return res.json({withdrawn:true});
  }
  return res.status(410).json({message:'Activity collection has been removed; use attendance and task updates'});
}));
for(const action of ['start','pause','resume','stop'])router.post(`/monitoring/sessions/${action}`,handle(async(req,res)=>{
  if(['start','resume'].includes(action))return res.status(410).json({message:'Activity collection has been removed'});
  const {employee,work}=await ownWork(req);
  let result;
  await WorkSession.db.transaction(async session=>{
    const locked=await WorkSession.findOneAndUpdate({_id:work._id,status:'open'},{$set:{reason:`monitoring ${action}`}},{new:true,session});
    if(!locked)fail('Attendance ended',409);
    let m=await MonitoringSession.findOne({workSession:work._id,status:{$ne:'stopped'}}).session(session);
    const now=new Date();
    if(m?.authorizationExpiresAt && m.authorizationExpiresAt<=now){
      if(m.intervals.at(-1)&&!m.intervals.at(-1).end)m.intervals.at(-1).end=m.authorizationExpiresAt;
      m.stop=m.authorizationExpiresAt;m.status='stopped';m.agentStatus='authorization expired';await m.save({session});m=null;
    }
    const consent=await MonitoringConsent.findOne({employee:employee._id,withdrawnAt:null}).sort({createdAt:-1}).session(session);
    if(['start','resume'].includes(action)&&!consent)fail('Monitoring consent required',403);
    if(action==='start'&&!m)m=new MonitoringSession({employee:employee._id,workSession:work._id,consent:consent._id,start:now,intervals:[{start:now}],os:req.body.os||'browser',agentVersion:req.body.agentVersion,lastHeartbeat:now,agentStatus:'connected'});
    else if(!m)fail('No monitoring session',409);
    else if(action==='resume'&&m.status==='paused'){m.intervals.push({start:now});m.status='active';m.lastHeartbeat=now;m.agentStatus='connected';}
    else if(['pause','stop'].includes(action)){if(m.intervals.at(-1)&&!m.intervals.at(-1).end)m.intervals.at(-1).end=now;m.status=action==='stop'?'stopped':'paused';if(action==='stop')m.stop=now;}
    if (['start','resume'].includes(action)) { m.consent=consent._id; m.authorizationExpiresAt=req.authExpiresAt; if(req.body.os && (req.body.os!=='browser' || m.os==='browser'))m.os=req.body.os; if(req.body.agentVersion)m.agentVersion=req.body.agentVersion; }
    await m.save({session});result=m;
  });
  sessionUpdated(req.user._id,result);res.json(result);
}));
router.post('/monitoring/events/batch',handle(async(req,res)=>{
  await employeeFor(req.user);
  res.status(410).json({message:'Activity collection has been removed'});
}));
router.get('/monitoring/me/activity',handle(async(req,res)=>{
  const employee=await employeeFor(req.user);
  const works=await WorkSession.find({employee:employee._id}).sort({checkIn:-1}).limit(31).lean();
  res.json(await Promise.all(works.map(async w=>({...w,summary:w.summary||await report(w)}))));
}));
router.post('/monitoring/me/corrections',handle(async(req,res)=>{
  const employee=await employeeFor(req.user);
  if(typeof req.body.reason!=='string'||!req.body.reason.trim()||req.body.reason.length>2000)fail('Correction reason required');
  const work=await WorkSession.findOne({_id:req.body.sessionId,employee:employee._id});if(!work)fail('Session not found',404);
  res.status(201).json(await AuditLog.create({actor:req.user._id,action:'correction requested',target:String(work._id),reason:req.body.reason}));
}));
router.use('/admin',requireAdmin);
router.get('/admin/notifications',handle(async(req,res)=>{
  res.json({notifications:await AdminNotification.find({recipient:req.user._id}).sort({createdAt:-1}).limit(100),unread:await AdminNotification.countDocuments({recipient:req.user._id,readAt:null})});
}));
router.patch('/admin/notifications/:id/read',handle(async(req,res)=>{
  const n=await AdminNotification.findOneAndUpdate({_id:req.params.id,recipient:req.user._id},{$set:{readAt:new Date()}},{new:true});if(!n)fail('Not found',404);res.json(n);
}));
const reports=handle(async(req,res)=>{
  const query={};
  if(req.params.employeeId||req.query.employee)query.employee=req.params.employeeId||req.query.employee;
  if(req.query.status)query.status=req.query.status;
  if(req.query.from||req.query.to){query.checkIn={};for(const [key,op]of [['from','$gte'],['to','$lte']])if(req.query[key]){const date=new Date(req.query[key]);if(!Number.isFinite(+date))fail('Invalid date');query.checkIn[op]=date;}}
  if(req.query.department){const employees=await Employee.find({department:req.query.department}).select('_id');query.employee={$in:employees.map(e=>e._id)};}
  if(req.query.agentStatus){const monitors=await MonitoringSession.find({agentStatus:req.query.agentStatus}).select('workSession');query._id={$in:monitors.map(m=>m.workSession)};}
  if(req.query.category){const events=await ActivityEvent.find({category:req.query.category}).distinct('monitoringSession');const monitors=await MonitoringSession.find({_id:{$in:events}}).distinct('workSession');const previous=query._id?.$in;query._id={$in:previous?monitors.filter(id=>previous.some(p=>String(p)===String(id))):monitors};}
  const page=Math.max(1,Math.floor(Number(req.query.page)||1));
  const works=await WorkSession.find(query).populate('employee','name username department photo').sort({checkIn:-1}).skip((page-1)*25).limit(25).lean();
  res.json({page,total:await WorkSession.countDocuments(query),sessions:await Promise.all(works.map(async w=>({...w,summary:w.summary||await report(w)})))});
});
router.get('/admin/monitoring/export',handle(async(req,res)=>{
  await AuditLog.create({actor:req.user._id,action:'report export',reason:'Administrator exported activity summaries'});
  const sessions=await WorkSession.find({status:'completed'}).sort({checkIn:-1}).limit(1000).lean();
  res.json(sessions.map(w=>({_id:w._id,employee:w.employee,checkIn:w.checkIn,checkOut:w.checkOut,timezone:w.timezone,summary:w.summary})));
}));
router.delete('/admin/monitoring/employees/:employeeId/data',requireSuperadmin,handle(async(req,res)=>{
  if(typeof req.body.reason!=='string'||!req.body.reason.trim())fail('Administrative deletion reason required');
  const employee=req.params.employeeId;
  if(await WorkSession.exists({employee,status:'open'}))fail('End attendance before deletion',409);
  await WorkSession.db.transaction(async session=>{
    await ActivityEvent.deleteMany({employee},{session});
    await MonitoringSession.deleteMany({employee},{session});
    await MonitoringConsent.deleteMany({employee},{session});
    await AdminNotification.deleteMany({employee},{session});
    const {ActivitySummary}=await import('../models/Monitoring.js');
    await ActivitySummary.deleteMany({employee},{session});
    await WorkSession.deleteMany({employee},{session});
    await AuditLog.create([{actor:req.user._id,action:'activity records deleted',target:employee,reason:req.body.reason}],{session});
  });res.json({deleted:true});
}));
router.get('/admin/monitoring/overview',handle(async(req,res)=>{
  const period=req.query.period||'day';if(!['day','week','month'].includes(period))fail('Period must be day, week, or month');
  const totals=await WorkSession.aggregate([
    {$match:{status:'completed'}},
    {$group:{_id:{$dateTrunc:{date:'$checkIn',unit:period,timezone:'UTC'}},sessions:{$sum:1},attendanceSeconds:{$sum:'$summary.attendanceSeconds'},monitoringSeconds:{$sum:'$summary.monitoringSeconds'},activeSeconds:{$sum:'$summary.activeSeconds'},idleSeconds:{$sum:'$summary.idleSeconds'},unclassifiedSeconds:{$sum:'$summary.unclassifiedSeconds'}}},
    {$sort:{_id:-1}},{$limit:31}
  ]);
  res.json({checkedIn:await WorkSession.countDocuments({status:'open'}),monitoring:await MonitoringSession.countDocuments({status:'active'}),disconnected:await MonitoringSession.countDocuments({agentStatus:'disconnected',status:'paused'}),period,timezone:'UTC',periods:totals});
}));
router.get('/admin/monitoring/reports',reports);
router.get('/admin/monitoring/employees/:employeeId',reports);
export default router;
