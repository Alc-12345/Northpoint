import { EventEmitter } from 'node:events';
export const monitoringEvents = new EventEmitter();
import Employee from '../models/Employee.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import { WorkSession, MonitoringSession, ActivityEvent, ActivitySummary, AdminNotification } from '../models/Monitoring.js';
import { calculate } from './activityDurations.js';
export const employeeFor = async user => {
  if (user.role !== 'employee') throw Object.assign(new Error('Employee account required'), { status: 403 });
  const employee = await Employee.findOne({ user: user._id });
  if (!employee || employee.status === 'Resigned') throw Object.assign(new Error('Active employee record required'), { status: 403 });
  return employee;
};
export async function checkIn(employee, timezone = 'UTC') {
  try { new Intl.DateTimeFormat('en',{timeZone:timezone}); } catch { throw Object.assign(new Error('Invalid timezone'),{status:400}); }
  try { return await WorkSession.findOneAndUpdate({employee:employee._id,status:'open'},{$setOnInsert:{checkIn:new Date(),timezone}},{upsert:true,new:true}); }
  catch(error) { if(error.code!==11000)throw error;const existing=await WorkSession.findOne({employee:employee._id,status:'open'});if(!existing)throw error;return existing; }
}
export async function report(work, session) {
  const monitoring = await MonitoringSession.find({ workSession: work._id }).session(session || null).lean();
  const events = await ActivityEvent.find({ monitoringSession: { $in: monitoring.map(m=>m._id) } }).session(session || null).lean();
  return { ...calculate(work,monitoring,events), monitoring, eventCount: events.length };
}
export async function finalize(employee, sessionId, reason = 'checkout') {
  let result, finalized=false;
  await WorkSession.db.transaction(async session => {
    const work = sessionId ? await WorkSession.findOne({ _id: sessionId, employee: employee._id }).session(session) : await WorkSession.findOne({ employee: employee._id, status: 'open' }).session(session);
    if (!work) { result = null; return; }
    if (work.status !== 'open') { result = work; return; }
    const now = new Date(); finalized=true;
    for (const interval of work.breaks) if (!interval.end) interval.end = now;
    work.checkOut = now; work.status = 'completed'; work.reason = reason;
    await work.save({ session });
    const monitors = await MonitoringSession.find({ workSession: work._id, status: { $ne: 'stopped' } }).session(session);
    for (const m of monitors) {
      let boundary = m.authorizationExpiresAt && m.authorizationExpiresAt < now ? m.authorizationExpiresAt : now;
      if (m.os !== 'browser' && m.lastHeartbeat && now - m.lastHeartbeat > 60000) boundary = new Date(Math.min(+boundary, +m.lastHeartbeat));
      if (m.intervals.at(-1) && !m.intervals.at(-1).end) m.intervals.at(-1).end = boundary;
      m.stop = boundary; m.status = 'stopped'; m.agentStatus = boundary < now ? 'disconnected or authorization expired' : 'session completed'; await m.save({ session });
    }
    const tasks = await Task.find({ assignedTo: { $in: [String(employee._id), employee.email, employee.name, employee.username].filter(Boolean) } }).session(session).lean();
    work.summary = { ...await report(work,session), tasks, employeeName: employee.name, employeeCode: employee.username || String(employee._id), photo: employee.photo, checkIn: work.checkIn, checkOut: now, timezone: work.timezone, agentStatus: monitors.length ? 'session completed' : 'unknown' };
    await work.save({ session });
    await ActivitySummary.updateOne({ session: work._id }, { $set: { employee: employee._id, data: work.summary } }, { upsert: true, session });
    const admins = await User.find({ role: { $in: ['admin','superadmin'] } }).session(session);
    for (const admin of admins) await AdminNotification.updateOne({ recipient: admin._id, deduplicationKey: `logout:${work._id}` }, { $setOnInsert: { employee: employee._id, session: work._id, data: work.summary } }, { upsert: true, session });
    result = work;
  });
  if(finalized)monitoringEvents.emit('employee:logout',{employee:employee._id,session:result._id,summary:result.summary});
  return result;
}
