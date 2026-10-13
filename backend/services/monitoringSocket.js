import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import Employee from '../models/Employee.js';
import { WorkSession } from '../models/Monitoring.js';
import User from '../models/User.js';
import { AdminNotification, MonitoringSession } from '../models/Monitoring.js';
let io;
export async function deliverNotifications() {
  if (!io) return;
  const pending = await AdminNotification.find({ deliveredAt: null }).limit(100);
  for (const notification of pending) {
    const user = await User.findById(notification.recipient);
    if (['admin','superadmin'].includes(user?.role)) {
      const room = `user:${user._id}`;
      io.to(room).emit('admin:employee-logout',notification);
      io.to(room).emit('admin:notification',notification);
      io.to(room).emit('admin:notification-count', await AdminNotification.countDocuments({ recipient: user._id, readAt: null }));
    }
    notification.deliveredAt = new Date(); await notification.save();
  }
}
export function sessionUpdated(user, data) { io?.to(`user:${user}`).emit('monitoring:session-updated',data); }
export function attachMonitoringSocket(server) {
  io = new Server(server, { cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' } });
  io.use(async (socket,next) => {
    try {
      const decoded = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET || 'dev_jwt_secret_change_me');
      const user = await User.findById(decoded.id);
      if (!user || (decoded.version || 0) !== (user.tokenVersion || 0)) throw new Error('Unauthorized');
      socket.user = user; socket.version = decoded.version || 0; socket.expires = decoded.exp * 1000; next();
    } catch { next(new Error('Unauthorized')); }
  });
  io.on('connection', socket => {
    socket.join(`user:${socket.user._id}`);
    const expiry = setTimeout(()=>socket.disconnect(true),Math.max(0,socket.expires-Date.now()));
    socket.on('disconnect',()=>clearTimeout(expiry));
  });
  const timer = setInterval(async () => {
    try {
      for (const socket of io.sockets.sockets.values()) {
        const user = await User.findById(socket.user._id);
        if (!user || (user.tokenVersion || 0) !== socket.version || user.role !== socket.user.role) socket.disconnect(true);
      }
      await deliverNotifications();
      const stale = await MonitoringSession.find({ status: { $in: ['active','paused'] }, $or: [
        {authorizationExpiresAt: {$lt:new Date()}},
        {status:'active',lastHeartbeat: {$lt:new Date(Date.now()-60000)},os:{$ne:'browser'}}
      ] });
      for (const previous of stale) {
        let result;
        await WorkSession.db.transaction(async session=>{
          await WorkSession.updateOne({_id:previous.workSession,status:'open'},{$set:{reason:'monitoring authorization check'}},{session});
          const m=await MonitoringSession.findById(previous._id).session(session);
          if(!m||m.status==='stopped')return;
          const expired=m.authorizationExpiresAt&&m.authorizationExpiresAt<new Date();
          if(!expired&&(m.status!=='active'||m.lastHeartbeat>=new Date(Date.now()-60000)))return;
          const boundary=expired?m.authorizationExpiresAt:m.lastHeartbeat;
          if(m.intervals.at(-1)&&!m.intervals.at(-1).end)m.intervals.at(-1).end=boundary;
          m.status=expired?'stopped':'paused';m.agentStatus=expired?'authorization expired':'disconnected';if(expired)m.stop=boundary;
          await m.save({session});result=m;
        });
        if(result){const employee=await Employee.findById(result.employee);if(employee?.user)sessionUpdated(employee.user,result);}
      }
    } catch (error) { console.error('Monitoring recovery:',error.message); }
  },15000);
  timer.unref(); server.on('close',()=>clearInterval(timer));
  return io;
}
