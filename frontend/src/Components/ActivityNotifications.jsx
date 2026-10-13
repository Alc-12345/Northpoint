import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { duration } from '../utils/duration';
export function LogoutSummary({ data }) {
  return <div className="space-y-1 text-sm">
    <p>{data.employeeCode} · {data.agentStatus}</p>
    <p>Check-in: {new Date(data.checkIn).toLocaleString(undefined,{timeZone:data.timezone})}</p>
    <p>Logout: {new Date(data.checkOut).toLocaleString(undefined,{timeZone:data.timezone})}</p>
    <p>Attendance {duration(data.attendanceSeconds)} · Monitoring {duration(data.monitoringSeconds)}</p>
    <p>Observed active {duration(data.activeSeconds)} · Idle {duration(data.idleSeconds)} · Unclassified {duration(data.unclassifiedSeconds)}</p>
    <p>Applications: {Object.entries(data.applications || {}).map(([k,v])=>`${k}: ${duration(v)}`).join(', ') || 'Unknown'}</p>
    <p>Website categories: {Object.entries(data.websites || {}).map(([k,v])=>`${k}: ${duration(v)}`).join(', ') || 'Unknown'}</p>
    <p>Tasks: {(data.tasks || []).filter(t=>t.status==='Completed').length} completed · {(data.tasks || []).filter(t=>t.status!=='Completed').length} pending</p>
  </div>;
}
export default function ActivityNotifications() {
  const seen=useRef(new Set());
  const [notifications,setNotifications]=useState([]),[unread,setUnread]=useState(0),[popup,setPopup]=useState(null),[open,setOpen]=useState(false);
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem('authUser') || '{}');
    const token=localStorage.getItem('authToken');
    if(!token || !['admin','superadmin'].includes(user.role))return;
    let alive=true;
    const refresh=()=>api.get('/admin/notifications').then(({data})=>{if(alive){setNotifications(data.notifications);setUnread(data.unread);}}).catch(()=>{});
    const socket=io((import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/api\/?$/,''),{auth:{token}});
    socket.on('connect',refresh);
    socket.on('admin:employee-logout',n=>{if(alive&&!seen.current.has(n._id)){seen.current.add(n._id);setPopup(n);window.dispatchEvent(new Event("northpoint:logout"));refresh();}});
    socket.on('admin:notification-count',setUnread);
    window.addEventListener("northpoint:notifications-read",refresh);
    refresh();const interval=setInterval(refresh,30000);
    return ()=>{alive=false;clearInterval(interval);window.removeEventListener("northpoint:notifications-read",refresh);socket.disconnect();};
  },[]);
  const read=async n=>{await api.patch(`/admin/notifications/${n._id}/read`);setUnread(v=>Math.max(0,v-(!n.readAt?1:0)));setNotifications(v=>v.map(x=>x._id===n._id?{...x,readAt:new Date()}:x));};
  if(!['admin','superadmin'].includes(JSON.parse(localStorage.getItem('authUser') || '{}').role))return null;
  return <div className="fixed right-5 top-4 z-50">
    <button onClick={()=>setOpen(!open)} className="rounded-lg bg-slate-900 px-4 py-2 text-white">Activity notifications ({unread})</button>
    {open && <div className="mt-2 max-h-[70vh] w-96 overflow-auto rounded-xl border bg-white p-4 shadow-xl"><Link to="/monitoring" className="text-blue-600">Open monitoring dashboard</Link>{!notifications.length&&<p>No notifications.</p>}{notifications.map(n=><div key={n._id} className="border-b py-3"><strong>{n.data.employeeName} logged out</strong><LogoutSummary data={n.data}/><Link to={`/monitoring?employee=${n.employee}&session=${n.session}`} onClick={()=>read(n)} className="text-blue-600">View full report</Link><button onClick={()=>read(n)} className="ml-4">{n.readAt?'Read':'Mark read'}</button></div>)}</div>}
    {popup && <div role="alert" className="mt-3 w-96 rounded-xl border bg-white p-5 shadow-xl">{popup.data.photo&&<img src={popup.data.photo} alt="" className="h-10 w-10 rounded-full"/>}<h2 className="font-bold">Employee Logout: {popup.data.employeeName}</h2><LogoutSummary data={popup.data}/><p className="text-xs">Session {popup.session}</p><Link to={`/monitoring?employee=${popup.employee}&session=${popup.session}`} onClick={()=>{read(popup);setPopup(null);}} className="text-blue-600">View Full Report</Link><button className="ml-4" onClick={()=>setPopup(null)}>Dismiss</button></div>}
  </div>;
}
