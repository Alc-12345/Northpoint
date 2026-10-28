import { test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import User from '../models/User.js';
import { LockerSettings } from '../models/Locker.js';

test('locker protects files, isolates personal folders and revokes sessions on reset', async () => {
  const mongo = await MongoMemoryServer.create();
  try {
    await mongoose.connect(mongo.getUri());
    const create = async (name, role) => { const user = new User({ name, email: `${name}@test.com`, role }); user.setPassword('account-password'); await user.save(); return jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'dev_jwt_secret_change_me'); };
    const admin = await create('admin', 'admin');
    const other = await create('other', 'admin');
    const employee = await create('employee', 'employee');
    const send = (method, path, auth = admin, token) => { const req = request(app)[method](`/api/hr/locker${path}`).set('Authorization', `Bearer ${auth}`); if (token) req.set('X-Locker-Token', token); return req; };
    assert.equal((await send('get', '/folders', employee)).status, 403);
    assert.equal((await send('get', '/folders')).status, 423);
    assert.equal((await send('post', '/unlock').send({ password: 'wrong' })).status, 403);
    const unlock = await send('post', '/unlock').send({ password: 'ashish' });
    assert.equal(unlock.status, 200);
    const token = unlock.body.token;
    assert.notEqual((await LockerSettings.findById('locker')).hash, 'ashish');
    const folder = await send('post', '/folders', admin, token).send({ name: 'Private', kind: 'personal' });
    assert.equal(folder.status, 201);
    const path = `/folders/${folder.body._id}/files`;
    const upload = await send('post', path, admin, token).send({ name: 'test.txt', content: Buffer.from('confidential').toString('base64') });
    assert.equal(upload.status, 201);
    assert.equal(upload.body.data, undefined);
    assert.equal((await send('get', path)).status, 423);
    assert.equal((await send('get', `${path}/${upload.body._id}`, admin, token)).status, 200);
    const otherToken = (await send('post', '/unlock', other).send({ password: 'ashish' })).body.token;
    assert.equal((await send('get', path, other, otherToken)).status, 404);
    assert.equal((await send('get', path, other, token)).status, 423);
    assert.equal((await send('post', '/reset-password').send({ accountPassword: 'wrong', newPassword: 'new-password' })).status, 403);
    assert.equal((await send('post', '/reset-password').send({ accountPassword: 'account-password', newPassword: 'new-password' })).status, 200);
    assert.equal((await send('get', path, admin, token)).status, 423);
    assert.equal((await send('post', '/unlock').send({ password: 'ashish' })).status, 403);
    const updated = (await send('post', '/unlock').send({ password: 'new-password' })).body.token;
    assert.equal((await send('post', '/lock', admin, updated)).status, 200);
    assert.equal((await send('get', '/folders', admin, updated)).status, 423);
  } finally { await mongoose.disconnect(); await mongo.stop(); }
});
