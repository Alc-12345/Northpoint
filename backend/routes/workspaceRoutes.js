import express from 'express';
import rateLimit from 'express-rate-limit';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Client from '../models/Client.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import HrDocument from '../models/HrDocument.js';
import SupportTicket from '../models/SupportTicket.js';
import { WorkSession, AdminNotification, AuditLog } from '../models/Monitoring.js';
const router = express.Router();
router.use(protect, rateLimit({windowMs:60000,limit:120}));
const admins = ['admin','superadmin'];
const employeeIdentity = async user => {
  const employee = await Employee.findOne({user:user._id});
  return {employee, identifiers:[String(user._id),user.email,user.username,employee && String(employee._id),employee?.email,employee?.username].filter(Boolean)};
};
router.get('/reports/:kind',requireAdmin,async(req,res)=>{
  const model=req.params.kind==='tasks'?Task:req.params.kind==='projects'?Project:null;
  if(!model)return res.status(404).json({message:'Unknown report type'});
  res.json(await model.find().sort({updatedAt:-1}).limit(1000).select('title name status progress priority totalWorkingHours').lean());
});
router.get('/settings',async(req,res)=>{
  res.json({account:{name:req.user.name,email:req.user.email,username:req.user.username,role:req.user.role},preferences:{theme:'light',timezone:'UTC',...req.user.preferences?.toObject?.()}});
});
router.patch('/settings',async(req,res)=>{
  const {theme,timezone}=req.body;
  if(!['light','dark'].includes(theme)||typeof timezone!=='string')return res.status(400).json({message:'Choose a valid theme and timezone'});
  try {new Intl.DateTimeFormat('en',{timeZone:timezone});}catch{return res.status(400).json({message:'Invalid timezone'});}
  const user=await User.findByIdAndUpdate(req.user._id,{$set:{'preferences.theme':theme,'preferences.timezone':timezone}},{returnDocument:'after',runValidators:true});
  res.json({preferences:user.preferences});
});
async function notifications(user){
  let items=[];
  if(admins.includes(user.role))items= (await AdminNotification.find({recipient:user._id}).sort({createdAt:-1}).limit(100).lean()).map(n=>({id:String(n._id),title:`${n.data.employeeName} logged out`,message:`Attendance session completed · ${n.data.employeeCode}`,at:n.createdAt,read:!!n.readAt,href:`/monitoring?employee=${n.employee}&session=${n.session}`}));
  else if(user.role==='employee'){
    const {employee,identifiers}=await employeeIdentity(user);
    if(employee){const sessions=await WorkSession.find({employee:employee._id,status:'completed'}).sort({checkOut:-1}).limit(50).lean();items=sessions.map(w=>({id:`session:${w._id}`,title:'Attendance session completed',message:`Check-out recorded ${new Date(w.checkOut).toISOString()}`,at:w.checkOut,href:`/employee-activity?session=${w._id}`}));}
    const tasks=await Task.find({assignedTo:{$in:identifiers}}).sort({updatedAt:-1}).limit(50).lean();
    items.push(...tasks.map(t=>({id:`task:${t._id}:${+t.updatedAt}`,title:`Task: ${t.title}`,message:`${t.status} · ${t.progress||0}% progress`,at:t.updatedAt,href:'/employee-tasks'})));
  }else if(user.role==='client'){
    const client=await Client.findOne({user:user._id});
    if(client){const projects=await Project.find({client:client._id}).sort({updatedAt:-1}).limit(50).lean();items=projects.map(p=>({id:`project:${p._id}:${+p.updatedAt}`,title:p.name,message:`${p.status} · ${p.progress||0}% progress`,at:p.updatedAt,href:'/client/project-progress'}));}
  }
  const tickets=await SupportTicket.find(admins.includes(user.role)?{}:{requester:user._id}).sort({updatedAt:-1}).limit(50).lean();
  const supportHref=user.role==='client'?'/client/help-desk':user.role==='employee'?'/employee-help-desk':'/help-desk';
  items.push(...tickets.map(t=>({id:`support:${t._id}:${+t.updatedAt}`,title:t.subject,message:`Support ticket · ${t.status}`,at:t.updatedAt,href:supportHref})));
  const read=new Set(user.notificationReadIds||[]);
  return items.sort((a,b)=>new Date(b.at)-new Date(a.at)).slice(0,100).map(n=>({...n,read:!!n.read||read.has(n.id)}));
}
router.get('/notifications',async(req,res)=>{
  const items=await notifications(req.user);res.json({notifications:items,unread:items.filter(n=>!n.read).length});
});
router.patch('/notifications/read',async(req,res)=>{
  const ids=req.body.ids;
  if(!Array.isArray(ids)||ids.length>100||ids.some(id=>typeof id!=='string'))return res.status(400).json({message:'Provide up to 100 notification IDs'});
  const own=await notifications(req.user);const valid=new Set(own.map(n=>n.id));
  if(ids.some(id=>!valid.has(id)))return res.status(404).json({message:'Notification not found'});
  const persisted=admins.includes(req.user.role)?ids.filter(id=>/^[a-f0-9]{24}$/i.test(id)):[];
  if(persisted.length)await AdminNotification.updateMany({_id:{$in:persisted},recipient:req.user._id},{$set:{readAt:new Date()}});
  const derived=ids.filter(id=>!persisted.includes(id));
  if(derived.length)await User.updateOne({_id:req.user._id},{$push:{notificationReadIds:{$each:derived,$slice:-500}}});
  res.json({success:true});
});
router.get('/documents',async(req,res)=>{
  const documents=await HrDocument.find({recipient:req.user._id}).sort({createdAt:-1}).select('type values template items createdAt').lean();res.json(documents);
});
router.get('/document-management',requireAdmin,async(req,res)=>{
  res.json({documents:await HrDocument.find().sort({createdAt:-1}).limit(500).lean(),employees:await Employee.find({user:{$ne:null}}).select('name email username user').lean()});
});
router.patch('/documents/:id/recipient',requireAdmin,async(req,res)=>{
  if(req.body.recipient && !await User.exists({_id:req.body.recipient}))return res.status(404).json({message:'Recipient not found'});
  const document=await HrDocument.findByIdAndUpdate(req.params.id,{$set:{recipient:req.body.recipient||null}},{returnDocument:'after',runValidators:true});
  if(!document)return res.status(404).json({message:'Document not found'});
  await AuditLog.create({actor:req.user._id,action:'document recipient assigned',target:String(document._id),reason:`Recipient: ${req.body.recipient||'unassigned'}`});
  res.json({success:true});
});
router.get('/support',async(req,res)=>{
  const query=admins.includes(req.user.role)?{}:{requester:req.user._id};
  if(req.query.status){if(!['Open','In Progress','Resolved','Closed'].includes(req.query.status))return res.status(400).json({message:'Invalid support status'});query.status=req.query.status;}
  const search=typeof req.query.search==='string'?req.query.search.slice(0,120):'';
  if(search)query.subject={$regex:search.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),$options:'i'};
  const page=Math.max(1,Math.floor(Number(req.query.page)||1));
  res.json({page,total:await SupportTicket.countDocuments(query),tickets:await SupportTicket.find(query).populate('requester','name email').sort({updatedAt:-1}).skip((page-1)*20).limit(20)});
});
router.post('/support',async(req,res)=>{
  const {subject,description,category,priority}=req.body;
  if(typeof subject!=='string'||!subject.trim()||typeof description!=='string'||!description.trim())return res.status(400).json({message:'Subject and description are required'});
  res.status(201).json(await SupportTicket.create({requester:req.user._id,subject,description,category,priority}));
});
router.patch('/support/:id',async(req,res)=>{
  const query={_id:req.params.id,...(admins.includes(req.user.role)?{}:{requester:req.user._id})};
  const ticket=await SupportTicket.findOne(query);if(!ticket)return res.status(404).json({message:'Ticket not found'});
  const changes={};
  if(req.body.status!==undefined){if(!admins.includes(req.user.role))return res.status(403).json({message:'Only administrators can change ticket status'});changes.status=req.body.status;}
  const update={$set:changes};
  if(req.body.message!==undefined){if(typeof req.body.message!=='string'||!req.body.message.trim()||req.body.message.length>4000)return res.status(400).json({message:'Reply must contain 1–4000 characters'});update.$push={replies:{author:req.user._id,name:req.user.name,message:req.body.message.trim(),at:new Date()}};}
  if(!Object.keys(changes).length&&!update.$push)return res.status(400).json({message:'A reply or status change is required'});
  res.json(await SupportTicket.findOneAndUpdate(query,update,{returnDocument:'after',runValidators:true}));
});
export default router;
