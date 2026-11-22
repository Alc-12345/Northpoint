import { test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import User from '../models/User.js';

test('locker requires admin access and isolates personal folders', async () => {
  const mongo = await MongoMemoryServer.create();
  try {
    await mongoose.connect(mongo.getUri());
    const create = async (name, role) => { const user = new User({ name, email: `${name}@test.com`, role }); user.setPassword('account-password'); await user.save(); return jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'dev_jwt_secret_change_me'); };
    const admin = await create('admin', 'admin');
    const other = await create('other', 'admin');
    const employee = await create('employee', 'employee');
    const send = (method, path, auth = admin) => request(app)[method](`/api/hr/locker${path}`).set('Authorization', `Bearer ${auth}`);
    assert.equal((await send('get', '/folders', employee)).status, 403);
    assert.equal((await send('get', '/folders')).status, 200);
    const folder = await send('post', '/folders', admin).send({ name: 'Private', kind: 'personal' });
    assert.equal(folder.status, 201);
    const path = `/folders/${folder.body._id}/files`;
    const upload = await send('post', path, admin).send({ name: 'test.txt', content: Buffer.from('confidential').toString('base64') });
    assert.equal(upload.status, 201);
    assert.equal(upload.body.data, undefined);
    assert.equal((await send('get', path)).status, 200);
    assert.equal((await send('get', `${path}/${upload.body._id}`, admin)).status, 200);
    assert.equal((await send('get', path, other)).status, 404);
    const shared = await send('post', '/folders').send({ name: 'Customer', kind: 'client' });
    assert.equal(shared.status, 201);
    assert.equal((await send('get', `/folders/${shared.body._id}/files`, other)).status, 200);
  } finally { await mongoose.disconnect(); await mongo.stop(); }
});
