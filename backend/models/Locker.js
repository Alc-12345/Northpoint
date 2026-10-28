import mongoose from 'mongoose';
const { Schema } = mongoose;
export const LockerSettings = mongoose.model('LockerSettings', new Schema({ _id: String, hash: String, salt: String, version: { type: Number, default: 0 } }));
export const LockerSession = mongoose.model('LockerSession', new Schema({ tokenHash: String, user: Schema.Types.ObjectId, version: Number, expiresAt: { type: Date, expires: 0 } }));
export const LockerFolder = mongoose.model('LockerFolder', new Schema({ name: { type: String, required: true }, kind: { type: String, enum: ['client', 'personal'], required: true }, owner: { type: Schema.Types.ObjectId, required: true }, key: { type: String, unique: true } }, { timestamps: true }));
export const LockerFile = mongoose.model('LockerFile', new Schema({ folder: { type: Schema.Types.ObjectId, required: true, index: true }, name: String, size: Number, data: { type: Buffer, select: false }, uploadedBy: Schema.Types.ObjectId }, { timestamps: true }));
