const status=document.querySelector('#status');
window.agent.onStatus(data=>{status.textContent=`Monitoring ${data.monitoring?'ON':'OFF'} · ${data.message}`;});
async function run(action,data){try{await window.agent.action(action,data);}catch(error){status.textContent=error.message;}}
document.querySelector('#login').addEventListener('submit',event=>{event.preventDefault();const data=Object.fromEntries(new FormData(event.target));run('login',data);event.target.elements.password.value='';});
document.querySelector('#controls').addEventListener('click',event=>{const action=event.target.dataset.action;if(action)run(action,{accepted:document.querySelector('#consent').checked});});
