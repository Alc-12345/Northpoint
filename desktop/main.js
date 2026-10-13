import { app, BrowserWindow, ipcMain, powerMonitor, safeStorage } from 'electron';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { io } from 'socket.io-client';
import { foregroundApplication } from './foreground.js';
import { stateEvent, permittedQueue } from './collector.js';
let window, token, base, monitor, socket, timer, last, queue=[], syncing=false, collectorStatus="";
const queuePath = () => `${app.getPath('userData')}/queue.enc`;
const status = (message) => window?.webContents.send('status',{message,monitoring:!!timer});
async function persist() {
  if(!safeStorage.isEncryptionAvailable()) { queue=[];status('Secure storage unavailable; offline queue disabled');return; }
  await writeFile(queuePath(),safeStorage.encryptString(JSON.stringify({id:monitor?._id,queue})),{mode:0o600});
}
async function request(path, body, method='POST') {
  const response=await fetch(`${base}${path}`,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(method==='GET'?{}:{body:JSON.stringify(body||{})}),signal:AbortSignal.timeout(10000)});
  if(!response.ok){const error=new Error((await response.json()).message||'Request failed');error.status=response.status;throw error;}
  return response.json();
}
function stopLocal(message) { clearInterval(timer);timer=null;last=null;status(message); }
async function flush() {
  if(syncing||!monitor||!token)return;
  syncing=true;
  try {
    queue=permittedQueue(queue,monitor);
    const batch=queue.slice(0,200);
    await request('/monitoring/events/batch',{monitoringSessionId:monitor._id,events:batch});
    queue=queue.filter(e=>!batch.some(b=>b.key===e.key));await persist();status(`Monitoring enabled · synchronized ${collectorStatus}`);
  } catch(e) {
    // Fail closed: do not continue collecting without current server authorization.
    stopLocal(`Monitoring stopped: ${e.message}. Re-enable explicitly after reconnecting.`);
    if([401,403,409].includes(e.status)){monitor=null;queue=[];await unlink(queuePath()).catch(()=>{});}
  } finally { syncing=false; }
}
app.whenReady().then(()=>{
  window=new BrowserWindow({width:650,height:680,webPreferences:{preload:fileURLToPath(new URL('./preload.cjs',import.meta.url)),contextIsolation:true,nodeIntegration:false,sandbox:true}});
  window.loadFile(fileURLToPath(new URL('./index.html',import.meta.url)));
  window.on('close',()=>stopLocal('Application closed'));
  powerMonitor.on('suspend',()=>stopLocal('Computer suspended; explicitly re-enable monitoring'));
});
app.on('window-all-closed',()=>{stopLocal('Closed');socket?.disconnect();app.quit();});
ipcMain.handle('action',async(event,{action,data={}})=>{
  if(event.sender!==window.webContents)throw new Error('Unauthorized sender');
  if(action==='login'){
    const url=new URL(data.api);
    if(url.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(url.hostname))throw new Error('HTTPS required');
    stopLocal('Signing in');base=data.api.replace(/\/$/,'');
    const result=await request('/auth/login',{identifier:data.identifier,password:data.password,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone});
    if(result.user.role!=='employee')throw new Error('Employee login required');
    token=result.token;socket?.disconnect();socket=io(base.replace(/\/api$/,''),{auth:{token}});
    socket.on('monitoring:session-updated',m=>{if(m.status!=='active'){stopLocal(`Server monitoring status: ${m.status}`);monitor=null;queue=[];unlink(queuePath()).catch(()=>{});}});
    socket.on('disconnect',()=>stopLocal('Connection lost; re-enable explicitly'));
    setTimeout(()=>{stopLocal('Login expired');token=null;socket?.disconnect();},Math.max(0,JSON.parse(Buffer.from(token.split('.')[1],'base64url').toString()).exp*1000-Date.now()));
    status('Signed in. Collection is off.');return {name:result.user.name};
  }
  if(!token)throw new Error('Sign in first');
  if(action==='checkin')return request('/attendance/check-in',{timezone:Intl.DateTimeFormat().resolvedOptions().timeZone});
  if(action==='start'){
    if(data.accepted!==true)throw new Error('Explicit consent required');
    if(!['darwin','win32'].includes(process.platform))throw new Error('Only Windows and macOS supported');
    await request('/monitoring/consent',{accepted:true,policyVersion:'1',scope:['state','application']});
    const previous=await request('/monitoring/sessions/start',{os:process.platform,agentVersion:app.getVersion()});
    monitor=previous.status==='paused'?await request('/monitoring/sessions/resume'):previous;
    // Restart never resumes collection automatically. Recover only the same authorized session.
    queue=[];
    if(safeStorage.isEncryptionAvailable())try{const saved=JSON.parse(safeStorage.decryptString(await readFile(queuePath())));if(saved.id===monitor._id)queue=permittedQueue(saved.queue,monitor);}catch{ /* no valid queue */ }
    clearInterval(timer);last=Date.now();
    timer=setInterval(async()=>{
      const end=Date.now();const e=stateEvent(last,end,powerMonitor.getSystemIdleTime(),randomUUID());last=end;
      if(e)queue.push(e);
      try {
        const metadata = await foregroundApplication(); collectorStatus="";
        if (timer && e && e.type === 'active') queue.push({...e,...metadata,key:randomUUID(),type:'application'});
      } catch (error) { collectorStatus=`Foreground collector unavailable or permission denied: ${error.message}`; status(collectorStatus); }
      await persist();await flush();
    },5000);
    status('Monitoring enabled · active/idle signals only. Foreground application collector enabled; website extension unavailable.');return monitor;
  }
  if(['pause','stop','withdraw','checkout','logout'].includes(action)){
    stopLocal('Collection stopped');
    // Submit already authorized events while the server session is still open.
    await flush();
    const paths={pause:'/monitoring/sessions/pause',stop:'/monitoring/sessions/stop',withdraw:'/monitoring/consent',checkout:'/attendance/check-out',logout:'/auth/logout'};
    const result=await request(paths[action],action==='withdraw'?{withdraw:true}:{});
    monitor=null;queue=[];await unlink(queuePath()).catch(()=>{});
    if(action==='logout'){token=null;socket?.disconnect();}status(`${action} complete`);return result;
  }
  throw new Error('Unsupported action');
});
