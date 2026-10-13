import { io } from './socket.io.esm.min.js';
let state=null, socket=null;
async function request(path,body){const r=await fetch(`${state.api}${path}`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${state.token}`},body:JSON.stringify(body)});if(!r.ok)throw new Error('Authorization unavailable; monitoring stopped');return r.json();}
function category(domain){if(/(^|\.)(github.com|stackoverflow.com|developer.mozilla.org)$/.test(domain))return 'development';if(/(^|\.)(slack.com|teams.microsoft.com|zoom.us)$/.test(domain))return 'communication';return 'uncategorized';}
async function stop(){state=null;const oldSocket=socket;socket=null;oldSocket?.removeAllListeners();oldSocket?.disconnect();await chrome.alarms.clear('collect');}
// Worker restart intentionally discards credentials and authorization. No automatic collection.
chrome.runtime.onMessage.addListener((message,_sender,respond)=>{
 (async()=>{
  if(message.action==='stop'){await stop();return {message:'Monitoring OFF'};}
  if(message.action!=='enable')throw new Error('Unsupported action');
  await stop();const {api,identifier,password,accepted}=message.data;const url=new URL(api);
  if(accepted!=='on'||(url.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(url.hostname)))throw new Error('Explicit consent and HTTPS required');
  const r=await fetch(`${api}/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({identifier,password,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone})});if(!r.ok)throw new Error('Sign-in failed');const auth=await r.json();if(auth.user.role!=='employee')throw new Error('Employee account required');
  state={api,token:auth.token};await request('/monitoring/consent',{accepted:true,policyVersion:'1',scope:['website','state','application']});
  const m=await request('/monitoring/sessions/start',{os:'browser',agentVersion:'extension-1'});if(m.status!=='active')throw new Error('Resume your authorized session first');state.id=m._id;state.last=Date.now();
  socket=io(api.replace(/\/api\/?$/,''),{auth:{token:state.token}});
  socket.on('monitoring:session-updated',m=>{if(m.status!=='active')stop();});socket.on('disconnect',()=>stop());
  await chrome.alarms.create('collect',{periodInMinutes:0.5});return {message:'Website monitoring ON · current focused tab categories only'};
 })().then(respond,async error=>{await stop();respond({message:error.message});});return true;
});
chrome.alarms.onAlarm.addListener(async alarm=>{
 if(alarm.name!=='collect'||!state)return;
 try {
  const end=Date.now(),start=state.last;state.last=end;
  const win=await chrome.windows.getLastFocused();const tabs=await chrome.tabs.query({active:true,lastFocusedWindow:true});const tab=tabs[0];let events=[];
  if(win.focused&&tab?.url){const url=new URL(tab.url);if(['http:','https:'].includes(url.protocol))events=[{key:crypto.randomUUID(),type:'website',category:category(url.hostname),start:new Date(start).toISOString(),end:new Date(end).toISOString(),source:'extension'}];}
  await request('/monitoring/events/batch',{monitoringSessionId:state.id,events});
 }catch{await stop();}
});
