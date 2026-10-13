import {test} from 'node:test';import assert from 'node:assert/strict';import {stateEvent,permittedQueue} from '../collector.js';
test('idle is observational and queue recovery requires active authorization',()=>{
 const event=stateEvent(1000,2000,65,'one');assert.equal(event.type,'idle');
 assert.deepEqual(permittedQueue([event],null,3000),[]);
 assert.deepEqual(permittedQueue([event],{status:'paused',start:new Date(0)},3000),[]);
 assert.equal(permittedQueue([event],{status:'active',start:new Date(0)},3000).length,1);
 assert.deepEqual(permittedQueue([event],{status:'active',start:new Date(2500)},3000),[]);
 assert.deepEqual(permittedQueue([event],{status:'active',start:new Date(0)},4000000),[]);
});
import { foregroundApplication,applicationCategory } from '../foreground.js';
test('permission denial is exposed and collectors only request process names',async()=>{
 await assert.rejects(foregroundApplication('darwin',async()=>{throw new Error('Automation denied');}),/Automation denied/);
 const result=await foregroundApplication('win32',async(command,args)=>{assert.equal(command,'powershell.exe');assert.match(args.at(-1),/GetForegroundWindow/);return {stdout:'Code\n'};});
 assert.equal(result.application,'Code');assert.equal(result.category,'development');assert.equal(applicationCategory('Personal app'),'uncategorized');
});
