import assert from 'node:assert/strict';
import { before, after, beforeEach, test } from 'node:test';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import Task from '../models/Task.js';
import Employee from '../models/Employee.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import EtlWorkflow from '../models/EtlWorkflow.js';
import { mergeTaskNodes } from '../../shared/taskWorkflow.js';

let mongo;
let token;
let otherToken;
before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  for (const email of ['employee@example.com', 'other@example.com']) {
    const user = new User({ name: email, email, role: 'employee' });
    user.setPassword('test-password');
    await user.save();
    const signed = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev_jwt_secret_change_me');
    if (email.startsWith('employee')) token = signed;
    else otherToken = signed;
  }
});
after(async () => { await mongoose.disconnect(); await mongo?.stop(); });
beforeEach(async () => { await Task.deleteMany({}); await EtlWorkflow.deleteMany({}); });
const createTask = () => Task.create({ title: 'Build dashboard', assignedTo: 'employee@example.com', workCategory: 'frontend' });
const submit = (task, body, auth = token) => request(app).post(`/api/tasks/${task._id}/work`).set('Authorization', `Bearer ${auth}`).send(body);

test('employee work updates accumulate hours and appear in ETL without saving the canvas', async () => {
  const task = await createTask();
  await submit(task, { hours: 1.5, note: 'Built layout', description: 'Dashboard layout', status: 'In Progress', progress: 40 }).expect(200);
  const update = await submit(task, { hours: 0.5, note: 'Finished charts', status: 'Completed' }).expect(200);
  assert.equal(update.body.totalWorkingHours, 2);
  assert.equal(update.body.workLogs.length, 2);
  const workflow = await request(app).get('/api/etl/workflow').expect(200);
  const node = workflow.body.nodes.find(node => node.data.taskId === String(task._id));
  assert.equal(node.data.description, 'Dashboard layout');
  assert.equal(node.data.totalWorkingHours, 2);
  assert.equal(node.data.status, 'Completed');
  assert.equal(node.data.progress, 100);
  assert.equal(node.data.type, 'react-page');
});

test('rejects invalid hours, missing work notes, and another employee updating the task', async () => {
  const task = await createTask();
  await submit(task, { hours: -1, note: 'Work' }).expect(400);
  await submit(task, { hours: 0, note: 'Work' }).expect(400);
  await submit(task, { hours: 1, note: ' ' }).expect(400);
  await submit(task, { hours: 1, note: 'Work' }, otherToken).expect(403);
  await request(app).post(`/api/tasks/${task._id}/work`).send({ hours: 1, note: 'Work' }).expect(401);
  const list = await request(app).get('/api/tasks').set('Authorization', `Bearer ${otherToken}`).expect(200);
  assert.equal(list.body.length, 0);
  assert.equal((await Task.findById(task._id)).totalWorkingHours, 0);
});

test('submitted hours cannot be overwritten, deleted, or changed by stale ETL saves and runs', async () => {
  const task = await createTask();
  const stale = (await request(app).get('/api/etl/workflow')).body;
  await submit(task, { hours: 2, note: 'Built forms', status: 'In Progress', progress: 50 }).expect(200);
  await request(app).put(`/api/tasks/${task._id}`).send({ totalWorkingHours: 0, workLogs: [] }).expect(400);
  await request(app).put(`/api/tasks/${task._id}`).send({ $set: { totalWorkingHours: 0 } }).expect(200);
  await request(app).delete(`/api/tasks/${task._id}`).expect(400);
  for (const endpoint of ['/api/etl/workflow', '/api/etl/run']) {
    const response = await request(app).post(endpoint).send(stale).expect(200);
    const node = response.body.nodes.find(node => node.data.taskId === String(task._id));
    assert.equal(node.data.totalWorkingHours, 2);
    assert.equal(node.data.status, 'Running');
    assert.equal(node.data.progress, 50);
  }
  assert.equal((await Task.findById(task._id)).workLogs.length, 1);
});

test('concurrent work updates retain both entries and the correct total', async () => {
  const task = await createTask();
  await Promise.all([submit(task, { hours: 1, note: 'Layout' }).expect(200), submit(task, { hours: 2, note: 'Styles' }).expect(200)]);
  const saved = await Task.findById(task._id);
  assert.equal(saved.totalWorkingHours, 3);
  assert.equal(saved.workLogs.length, 2);
});

test('links work to an existing backend node and preserves canvas position', async () => {
  const task = await createTask();
  const nodes = [{ id: 'api-node', type: 'custom', position: { x: 10, y: 20 }, data: { label: 'API', type: 'rest-api', category: 'backend' } }];
  await request(app).post('/api/etl/workflow').send({ nodes, edges: [] }).expect(200);
  await submit(task, { hours: 1, note: 'Implemented route', etlNodeId: 'api-node' }).expect(200);
  const response = await request(app).get('/api/etl/workflow').expect(200);
  assert.equal(response.body.nodes.length, 1);
  assert.equal(response.body.nodes[0].id, 'api-node');
  assert.equal(response.body.nodes[0].data.category, 'backend');
  assert.deepEqual(response.body.nodes[0].position, { x: 10, y: 20 });
  const staleSave = await request(app).post('/api/etl/workflow').send({ nodes: [], edges: [] }).expect(200);
  assert.equal(staleSave.body.nodes[0].id, 'api-node');
  assert.equal(staleSave.body.nodes[0].data.totalWorkingHours, 1);
  assert.equal(staleSave.body.nodes[0].data.category, 'backend');
  const another = await Task.create({ title: 'Other task', assignedTo: 'employee@example.com' });
  await submit(another, { hours: 1, note: 'Conflicting link', etlNodeId: 'api-node' }).expect(400);
});

test('live task merges preserve unsaved manual nodes and locally dragged positions', () => {
  const nodes = [
    { id: 'manual', position: { x: 1, y: 2 }, data: { description: 'Unsaved edit' } },
    { id: 'linked', position: { x: 400, y: 300 }, data: { taskId: 'task1', totalWorkingHours: 1 } },
  ];
  const updated = mergeTaskNodes(nodes, [{ id: 'linked', position: { x: 0, y: 0 }, data: { taskId: 'task1', totalWorkingHours: 2 } }]);
  assert.deepEqual(updated[0], nodes[0]);
  assert.deepEqual(updated[1].position, nodes[1].position);
  assert.equal(updated[1].data.totalWorkingHours, 2);
});

 test('daily work dates and status snapshots persist and invalid dates are rejected', async () => {
  const task = await createTask();
  const updated = await submit(task, { hours: 3, note: 'Daily work', workDate: '2026-01-02', status: 'In Progress', progress: 30 }).expect(200);
  assert.equal(updated.body.workLogs[0].workDate, '2026-01-02');
  assert.equal(updated.body.workLogs[0].progress, 30);
  assert.equal(updated.body.workLogs[0].status, 'In Progress');
  for (const workDate of ['2026-02-30', 'invalid', '2999-01-01']) {
    await submit(task, { hours: 1, note: 'Invalid date', workDate }).expect(400);
  }
  await submit(task, { hours: 25, note: 'Too many hours' }).expect(400);
  assert.equal((await Task.findById(task._id)).totalWorkingHours, 3);
});

test('employees see only projects assigned to their employee account', async () => {
  await Employee.deleteMany({});
  await Project.deleteMany({});
  const user = await User.findOne({ email: 'employee@example.com' });
  const employee = await Employee.create({ name: user.name, email: user.email, user: user._id });
  const assigned = await Project.create({ name: 'Assigned project', assignedTeam: [employee._id] });
  await Project.create({ name: 'Unassigned project' });
  const mine = await request(app).get('/api/projects').set('Authorization', `Bearer ${token}`).expect(200);
  assert.deepEqual(mine.body.map(project => project._id), [String(assigned._id)]);
  const other = await request(app).get('/api/projects').set('Authorization', `Bearer ${otherToken}`).expect(200);
  assert.equal(other.body.length, 0);
});
