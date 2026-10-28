import express from 'express';
import crypto from 'node:crypto';
import { promisify } from 'node:util';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import { LockerSettings, LockerSession, LockerFolder, LockerFile } from '../models/Locker.js';
const router = express.Router();
const derive = promisify(crypto.scrypt);
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const credentials = async password => {
  const salt = crypto.randomBytes(16).toString('hex');
  return { salt, hash: (await derive(password, salt, 64)).toString('hex') };
};
const settings = async () => {
  let value = await LockerSettings.findById('locker');
  if (!value) {
    const initial = await credentials(process.env.LOCKER_INITIAL_PASSWORD || 'ashish');
    value = await LockerSettings.findOneAndUpdate({ _id: 'locker' }, { $setOnInsert: initial }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
  }
  return value;
};
router.use(protect, requireAdmin);
router.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
const attempts = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, keyGenerator: req => String(req.user._id), message: { message: 'Too many attempts. Try again in 15 minutes.' } });
router.post('/unlock', attempts, async (req, res) => {
  if (typeof req.body.password !== 'string' || req.body.password.length > 256) return res.status(400).json({ message: 'Enter a valid password' });
  const config = await settings();
  const hash = await derive(req.body.password, config.salt, 64);
  if (!crypto.timingSafeEqual(hash, Buffer.from(config.hash, 'hex'))) return res.status(403).json({ message: 'Incorrect locker password' });
  const token = crypto.randomBytes(32).toString('hex');
  await LockerSession.create({ tokenHash: digest(token), user: req.user._id, version: config.version, expiresAt: new Date(Date.now() + 30 * 60 * 1000) });
  res.json({ token });
});
router.post('/reset-password', attempts, async (req, res) => {
  const { accountPassword, newPassword } = req.body;
  if (typeof accountPassword !== 'string' || accountPassword.length > 256 || typeof newPassword !== 'string' || newPassword.length < 8 || newPassword.length > 256) return res.status(400).json({ message: 'Account password is required; new locker password must be 8–256 characters' });
  const user = await User.findById(req.user._id).select('+passwordHash +passwordSalt');
  if (!user.matchPassword(accountPassword)) return res.status(403).json({ message: 'Incorrect account password' });
  await settings();
  await LockerSettings.updateOne({ _id: 'locker' }, { $set: await credentials(newPassword), $inc: { version: 1 } });
  await LockerSession.deleteMany({});
  res.json({ message: 'Password reset. Unlock with your new password.' });
});
router.use(async (req, res, next) => {
  const token = req.get('X-Locker-Token');
  const config = await settings();
  const session = token && await LockerSession.findOne({ tokenHash: digest(token), user: req.user._id, version: config.version, expiresAt: { $gt: new Date() } });
  if (!session) return res.status(423).json({ message: 'Locker is locked. Unlock to continue.' });
  req.lockerSession = session;
  next();
});
router.post('/lock', async (req, res) => { await LockerSession.deleteOne({ _id: req.lockerSession._id }); res.json({ message: 'Locked' }); });
const access = req => ({ $or: [{ kind: 'client' }, { kind: 'personal', owner: req.user._id }] });
router.get('/folders', async (req, res) => res.json(await LockerFolder.find(access(req)).sort({ name: 1 })));
router.post('/folders', async (req, res) => {
  const { name, kind } = req.body;
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 120 || !['client', 'personal'].includes(kind)) return res.status(400).json({ message: 'Enter a folder name (up to 120 characters) and valid category' });
  const key = `${kind}:${kind === 'personal' ? req.user._id : 'shared'}:${name.trim().toLowerCase()}`;
  try { res.status(201).json(await LockerFolder.create({ name: name.trim(), kind, owner: req.user._id, key })); }
  catch (error) { if (error.code === 11000) return res.status(409).json({ message: 'A folder with this name already exists' }); throw error; }
});
router.use('/folders/:folderId', async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.folderId)) return res.status(404).json({ message: 'Folder not found' });
  const folder = await LockerFolder.findOne({ _id: req.params.folderId, ...access(req) });
  if (!folder) return res.status(404).json({ message: 'Folder not found' });
  req.lockerFolder = folder; next();
});
router.get('/folders/:folderId/files', async (req, res) => res.json(await LockerFile.find({ folder: req.lockerFolder._id }).sort({ createdAt: -1 })));
router.post('/folders/:folderId/files', async (req, res) => {
  const { name, content } = req.body;
  if (typeof name !== 'string' || !name.trim() || name.length > 200 || /[\x00-\x1f/\\]/.test(name) || typeof content !== 'string' || content.length > 6990508 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(content)) return res.status(400).json({ message: 'Invalid file. Maximum size is 5 MB.' });
  const data = Buffer.from(content, 'base64');
  if (!data.length || data.length > 5 * 1024 * 1024) return res.status(400).json({ message: 'File must be between 1 byte and 5 MB' });
  const file = await LockerFile.create({ folder: req.lockerFolder._id, name: name.trim(), size: data.length, data, uploadedBy: req.user._id });
  res.status(201).json({ _id: file._id, name: file.name, size: file.size, createdAt: file.createdAt });
});
router.get('/folders/:folderId/files/:fileId', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.fileId)) return res.status(404).json({ message: 'File not found' });
  const file = await LockerFile.findOne({ _id: req.params.fileId, folder: req.lockerFolder._id }).select('+data');
  if (!file) return res.status(404).json({ message: 'File not found' });
  res.set('Cache-Control', 'no-store'); res.set('X-Content-Type-Options', 'nosniff'); res.attachment(file.name); res.type('application/octet-stream'); res.send(file.data);
});
export default router;
