import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiCheck, FiRefreshCw } from 'react-icons/fi';
import api from '../services/api';
import WorkspacePage from '../Components/WorkspacePage';
export default function NotificationCenter() {
  const [items,setItems]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[filter,setFilter]=useState('all'),[busy,setBusy]=useState(false);
  const load=useCallback(async()=>{try{const {data}=await api.get('/workspace/notifications');setItems(data.notifications);setError('');}catch(e){setError(e.message);}finally{setLoading(false);}},[]);
  useEffect(()=>{let active=true;const refresh=()=>{if(active)load();};refresh();const timer=setInterval(refresh,30000);window.addEventListener('northpoint:logout',refresh);return()=>{active=false;clearInterval(timer);window.removeEventListener('northpoint:logout',refresh);};},[load]);
  const read=async ids=>{if(!ids.length)return;setBusy(true);try{await api.patch('/workspace/notifications/read',{ids});setItems(items=>items.map(n=>ids.includes(n.id)?{...n,read:true}:n));window.dispatchEvent(new Event('northpoint:notifications-read'));}catch(e){setError(e.message);}finally{setBusy(false);}};
  const unread=items.filter(n=>!n.read),visible=items.filter(n=>filter==='all'||!n.read),timezone=localStorage.getItem('timezone')||undefined;
  return <WorkspacePage title="Notifications" subtitle="Recent updates from your attendance, assignments, and support requests." actions={<><button onClick={load} disabled={loading}><FiRefreshCw/>Refresh</button><button onClick={()=>read(unread.map(n=>n.id))} disabled={busy||!unread.length}><FiCheck/>Mark all read</button></>}>
    {error&&<p role="alert" className="workspace-alert">{error}</p>}<div className="workspace-tabs"><button aria-pressed={filter==='all'} onClick={()=>setFilter('all')}>All updates ({items.length})</button><button aria-pressed={filter==='unread'} onClick={()=>setFilter('unread')}>Unread ({unread.length})</button></div>
    {loading?<p className="workspace-empty">Loading notifications…</p>:!visible.length?<div className="workspace-empty"><FiBell className="mx-auto mb-4" size={24}/><h2>{filter==='unread'?'You’re all caught up':'No notifications yet'}</h2><p>Updates appear here when activity is recorded for your account.</p></div>:<section className="workspace-panel" style={{padding:0}}>{visible.map(n=><article className="workspace-notice" data-unread={!n.read} key={n.id}><div><h2>{n.title}</h2><p className="workspace-muted">{n.message}</p><p className="workspace-muted mt-2">{new Date(n.at).toLocaleString(undefined,{timeZone:timezone})}</p></div><div className="workspace-actions"><Link className="workspace-button" to={n.href}>View details</Link>{!n.read&&<button disabled={busy} onClick={()=>read([n.id])}>Mark read</button>}</div></article>)}</section>}
  </WorkspacePage>;
}
