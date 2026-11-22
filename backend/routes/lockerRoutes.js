import express from 'express';
import mongoose from 'mongoose';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';
import { LockerFolder, LockerFile } from '../models/Locker.js';
const router = express.Router();
router.use(protect, requireAdmin);
router.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
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
