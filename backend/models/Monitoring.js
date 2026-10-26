import mongoose from 'mongoose';
const { Schema } = mongoose;
const id = (ref) => ({ type: Schema.Types.ObjectId, ref, required: true });
const interval = new Schema({ start: { type: Date, required: true }, end: Date }, { _id: false });
const make = (name, fields, indexes = []) => {
  const schema = new Schema(fields, { timestamps: true });
  for (const [keys, options] of indexes) schema.index(keys, options);
  return mongoose.model(name, schema);
};
export const WorkSession = make('WorkSession', {
  employee: id('Employee'), checkIn: { type: Date, required: true }, checkOut: Date,
  timezone: { type: String, required: true }, breaks: [interval],
  status: { type: String, enum: ['open', 'completed', 'incomplete'], default: 'open' },
  reason: String, summary: Schema.Types.Mixed,
}, [[{ employee: 1 }, { unique: true, partialFilterExpression: { status: 'open' } }], [{ employee: 1, checkIn: -1 }, {}]]);
export const MonitoringConsent = make('MonitoringConsent', {
  employee: id('Employee'), policyVersion: { type: String, required: true },
  scope: [{ type: String, enum: ['application', 'state', 'website'] }], acceptedAt: Date, withdrawnAt: Date,
});
export const MonitoringSession = make('MonitoringSession', {
  employee: id('Employee'), workSession: id('WorkSession'), consent: id('MonitoringConsent'),
  start: Date, stop: Date, intervals: [interval],
  status: { type: String, enum: ['active', 'paused', 'stopped'], default: 'active' },
  os: { type: String, enum: ['win32', 'darwin', 'browser'] }, agentVersion: String,
  authorizationExpiresAt: Date, lastHeartbeat: Date, agentStatus: { type: String, default: 'unknown' },
}, [[{ workSession: 1 }, { unique: true, partialFilterExpression: { status: { $in: ['active', 'paused'] } } }]]);
// Retain legacy website/extension values for historical reports; new activity ingestion is disabled.
export const ActivityEvent = make('ActivityEvent', {
  employee: id('Employee'), monitoringSession: id('MonitoringSession'),
  key: { type: String, required: true, maxlength: 128 },
  type: { type: String, enum: ['active', 'idle', 'application', 'website'], required: true },
  application: { type: String, maxlength: 100 }, category: { type: String, maxlength: 50 },
  start: { type: Date, required: true }, end: { type: Date, required: true },
  source: { type: String, enum: ['desktop', 'extension'], required: true },
  expiresAt: { type: Date, required: true },
}, [[{ monitoringSession: 1, key: 1 }, { unique: true }], [{ expiresAt: 1 }, { expireAfterSeconds: 0 }]]);
export const ActivitySummary = make('ActivitySummary', { employee: id('Employee'), session: id('WorkSession'), data: Schema.Types.Mixed }, [[{ session: 1 }, { unique: true }]]);
export const AdminNotification = make('AdminNotification', {
  recipient: id('User'), employee: id('Employee'), session: id('WorkSession'),
  type: { type: String, default: 'employee:logout' }, data: Schema.Types.Mixed,
  readAt: Date, deliveredAt: Date, deduplicationKey: { type: String, required: true },
}, [[{ recipient: 1, deduplicationKey: 1 }, { unique: true }], [{ recipient: 1, createdAt: -1 }, {}], [{ createdAt: 1 }, { expireAfterSeconds: 31536000 }]]);
export const AuditLog = make('AuditLog', { actor: id('User'), action: String, target: String, reason: { type: String, maxlength: 2000 } });
