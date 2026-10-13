import assert from 'node:assert/strict';
import { before,after,test } from 'node:test';
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createServer } from 'node:http';
import { io as connect } from 'socket.io-client';
import { attachMonitoringSocket } from '../services/monitoringSocket.js';
import app from '../app.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import { WorkSession, MonitoringSession, ActivityEvent, AdminNotification } from '../models/Monitoring.js';
let mongo,employee,token,adminToken,otherToken;
const call=(method,path,body={},auth=token)=>request(app)[method](`/api${path}`).set('Authorization',`Bearer ${auth}`).send(body);
before(async()=>{
 process.env.JWT_SECRET='monitoring-test';mongo=await MongoMemoryReplSet.create({replSet:{count:1}});await mongoose.connect(mongo.getUri());
 for(const role of ['employee','admin','employee']){
  const user=new User({name:role,email:`${role}-${Math.random()}@example.com`,role});user.setPassword('password');await user.save();
  const t=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1h'});
  if(role==='admin')adminToken=t;
  else {const e=await Employee.create({user:user._id,name:user.name,email:user.email,status:'Active'});if(!token){employee=e;token=t;}else otherToken=t;}
 }
 await Promise.all([WorkSession,MonitoringSession,ActivityEvent,AdminNotification].map(m=>m.init()));
});
after(async()=>{await mongoose.disconnect();await mongo?.stop();});
test('consent, own session boundaries, duration summary and deduplicated offline notifications',async()=>{
 const w=(await call('post','/attendance/check-in',{timezone:'Asia/Kolkata'}).expect(200)).body;
 await call('post','/monitoring/sessions/start').expect(403);
 await call('post','/monitoring/consent',{accepted:true,policyVersion:'1',scope:['state']}).expect(200);
 const m=(await call('post','/monitoring/sessions/start',{os:'darwin'}).expect(200)).body;
 const end=new Date();const start=new Date(m.start);
 const event={key:'one',type:'active',start,end:new Date(Math.max(+start+1,+end)).toISOString(),source:'desktop'};
 await new Promise(resolve=>setTimeout(resolve,5));
 await call('post','/monitoring/events/batch',{monitoringSessionId:m._id,events:[event]}).expect(200);
 const dup=await call('post','/monitoring/events/batch',{monitoringSessionId:m._id,events:[event]}).expect(200);assert.equal(dup.body.accepted,0);
 await call('post','/monitoring/events/batch',{monitoringSessionId:m._id,events:[event]},otherToken).expect(409);
 const closed=await call('post','/attendance/check-out',{sessionId:w._id}).expect(200);
 assert.ok(closed.body.summary.attendanceSeconds>=closed.body.summary.monitoringSeconds);
 await call('post','/attendance/check-out',{sessionId:w._id}).expect(200);
 assert.equal(await AdminNotification.countDocuments({session:w._id}),1);
 await call('post','/monitoring/events/batch',{monitoringSessionId:m._id,events:[event]}).expect(409);
 await call('get','/admin/notifications',{},token).expect(403);
 const history=await call('get','/admin/notifications',{},adminToken).expect(200);assert.equal(history.body.unread,1);assert.equal(history.body.notifications[0].data.employeeName,employee.name);
 await call('get',`/admin/monitoring/employees/${employee._id}`,{},otherToken).expect(403);
});
test('withdrawal stops monitoring while attendance remains open',async()=>{
 await call('post','/attendance/check-in').expect(200);
 const m=(await call('post','/monitoring/sessions/start',{os:'win32'}).expect(200)).body;
 await call('post','/monitoring/consent',{withdraw:true}).expect(200);
 assert.equal((await MonitoringSession.findById(m._id)).status,'stopped');
 assert.ok(await WorkSession.exists({employee:employee._id,status:'open'}));
 await call('post','/monitoring/events/batch',{monitoringSessionId:m._id,events:[]}).expect(409);
 await call('post','/monitoring/sessions/start').expect(403);
});

test('live logout summary reaches only authenticated administrators',async()=>{
 const server=createServer(app);const io=attachMonitoringSocket(server);
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url=`http://127.0.0.1:${server.address().port}`;
 const admin=connect(url,{auth:{token:adminToken}}),employeeSocket=connect(url,{auth:{token}});
 let leaked=false;employeeSocket.on('admin:employee-logout',()=>{leaked=true;});
 try {
  await Promise.all([admin,employeeSocket].map(socket=>new Promise((resolve,reject)=>{socket.once('connect',resolve);socket.once('connect_error',reject);}))); 
  const work=await WorkSession.findOne({employee:employee._id,status:'open'});
  const notification=new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Logout notification timed out')),5000);admin.on('admin:employee-logout',n=>{if(n.session===String(work._id)){clearTimeout(timer);resolve(n);}});});
  await call('post','/attendance/check-out',{sessionId:work._id}).expect(200);
  const received=await notification;
  assert.equal(received.session,String(work._id));assert.ok(received.data.checkOut);
  assert.ok(await AdminNotification.exists({_id:received._id}));
  await new Promise(resolve=>setTimeout(resolve,50));assert.equal(leaked,false);
 } finally {admin.disconnect();employeeSocket.disconnect();await new Promise(resolve=>io.close(resolve));}
});

test('pause gaps and expired monitoring authorization reject uploads',async()=>{
 const work=(await call('post','/attendance/check-in').expect(200)).body;
 const duplicate=(await call('post','/attendance/check-in').expect(200)).body;assert.equal(work._id,duplicate._id);
 await call('post','/monitoring/consent',{accepted:true,policyVersion:'1',scope:['state']}).expect(200);
 const m=(await call('post','/monitoring/sessions/start',{os:'darwin'}).expect(200)).body;
 await call('post','/monitoring/sessions/pause').expect(200);
 await call('post','/monitoring/events/batch',{monitoringSessionId:m._id,events:[]}).expect(409);
 const paused=await MonitoringSession.findById(m._id);
 await new Promise(resolve=>setTimeout(resolve,10));
 await call('post','/monitoring/sessions/resume').expect(200);
 await call('post','/monitoring/events/batch',{monitoringSessionId:m._id,events:[{key:'pause-gap',type:'active',start:new Date(+paused.intervals.at(-1).end+1),end:new Date(+paused.intervals.at(-1).end+2),source:'desktop'}]}).expect(400);
 await MonitoringSession.updateOne({_id:m._id},{$set:{authorizationExpiresAt:new Date(Date.now()-1000)}});
 await call('post','/monitoring/events/batch',{monitoringSessionId:m._id,events:[]}).expect(409);
 await call('post','/attendance/check-out',{sessionId:work._id}).expect(200);
});
test('employee login opens attendance without monitoring; logout revokes credentials',async()=>{
 const login=await request(app).post('/api/auth/login').send({identifier:employee.email,password:'password',timezone:'Asia/Kolkata'}).expect(200);
 const work=await WorkSession.findOne({employee:employee._id,status:'open'});assert.ok(work);assert.equal(work.timezone,'Asia/Kolkata');
 assert.equal(await MonitoringSession.countDocuments({workSession:work._id,status:'active'}),0);
 await call('post','/auth/logout',{},login.body.token).expect(200);
 await call('post','/auth/logout',{},login.body.token).expect(401);
 assert.equal(await AdminNotification.countDocuments({session:work._id}),1);
});
