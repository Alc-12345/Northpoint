import assert from 'node:assert/strict';
import {before,after,test} from 'node:test';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import HrDocument from '../models/HrDocument.js';
import Task from '../models/Task.js';
let mongo,employee,owner,other,admin;
const call=(method,path,body={},token=owner.token)=>request(app)[method](`/api/workspace${path}`).set('Authorization',`Bearer ${token}`).send(body);
before(async()=>{
  mongo=await MongoMemoryServer.create();await mongoose.connect(mongo.getUri());
  for(const [key,role] of [['owner','employee'],['other','employee'],['admin','admin']]){
    const user=new User({name:key,email:`${key}@example.com`,role});user.setPassword('password');await user.save();
    const record={user,token:jwt.sign({id:user._id},process.env.JWT_SECRET||'dev_jwt_secret_change_me')};
    if(key==='owner'){owner=record;employee=await Employee.create({name:key,email:user.email,user:user._id});}else if(key==='other')other=record;else admin=record;
  }
});
after(async()=>{await mongoose.disconnect();await mongo?.stop();});
test('settings persist only allowed preferences on the authenticated account',async()=>{
  await request(app).get('/api/workspace/settings').expect(401);
  await call('patch','/settings',{theme:'dark',timezone:'Asia/Kolkata',role:'superadmin'}).expect(200);
  const saved=await call('get','/settings').expect(200);assert.equal(saved.body.preferences.timezone,'Asia/Kolkata');assert.equal(saved.body.account.role,'employee');assert.equal(saved.body.account.passwordHash,undefined);
  const unrelated=await call('get','/settings',{},other.token).expect(200);assert.equal(unrelated.body.preferences.theme,'light');
  await call('patch','/settings',{theme:'light',timezone:'Invalid/Zone'}).expect(400);
});
test('support requests and replies are persisted with owner and admin permissions',async()=>{
  const created=await call('post','/support',{subject:'Attendance correction',description:'Please review my checkout.',category:'Attendance',priority:'High'}).expect(201);
  const id=created.body._id;
  const unrelated=await call('get','/support',{},other.token).expect(200);assert.equal(unrelated.body.total,0);
  await call('patch',`/support/${id}`,{message:'Read private ticket'},other.token).expect(404);
  await call('patch',`/support/${id}`,{status:'Resolved'}).expect(403);
  await call('patch',`/support/${id}`,{message:'Additional context'}).expect(200);
  const resolved=await call('patch',`/support/${id}`,{status:'Resolved',message:'We reviewed the record.'},admin.token).expect(200);
  assert.equal(resolved.body.status,'Resolved');assert.equal(resolved.body.replies.length,2);
});
test('document sharing is explicit and recipient-only',async()=>{
  const doc=await HrDocument.create({type:'offer-letter',values:{recipientName:'Owner'},template:'Hello {{recipientName}}',createdBy:admin.user._id});
  await call('patch',`/documents/${doc._id}/recipient`,{recipient:owner.user._id}).expect(403);
  await call('patch',`/documents/${doc._id}/recipient`,{recipient:owner.user._id},admin.token).expect(200);
  const mine=await call('get','/documents').expect(200);assert.equal(mine.body.length,1);
  const theirs=await call('get','/documents',{},other.token).expect(200);assert.equal(theirs.body.length,0);
  await call('get','/document-management').expect(403);
  const management=await call('get','/document-management',{},admin.token).expect(200);assert.equal(management.body.employees[0].generatedPassword,undefined);
});
test('notification read state and report data enforce scope',async()=>{
  const task=await Task.create({title:'Own task',assignedTo:String(employee._id)});
  const notifications=await call('get','/notifications').expect(200);
  const entry=notifications.body.notifications.find(n=>n.id.startsWith(`task:${task._id}:`));assert.ok(entry);assert.equal(entry.read,false);
  await call('patch','/notifications/read',{ids:[entry.id]},other.token).expect(404);
  await call('patch','/notifications/read',{ids:[entry.id]}).expect(200);
  const history=await call('get','/notifications').expect(200);assert.equal(history.body.notifications.find(n=>n.id===entry.id).read,true);
  await call('get','/reports/tasks').expect(403);
  const report=await call('get','/reports/tasks',{},admin.token).expect(200);assert.equal(report.body.length,1);
});
