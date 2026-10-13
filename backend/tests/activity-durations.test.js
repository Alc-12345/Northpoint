import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate, union } from '../services/activityDurations.js';
const at = n => new Date(n*1000);
test('attendance, monitoring, gaps, overlaps and unpaid breaks remain distinct',()=>{
 const work={checkIn:at(0),checkOut:at(3600),breaks:[{start:at(100),end:at(200)}]};
 const monitors=[{intervals:[{start:at(0),end:at(600)},{start:at(900),end:at(1500)}]}];
 const events=[{type:'active',start:at(0),end:at(300)},{type:'active',start:at(200),end:at(400)},{type:'idle',start:at(350),end:at(500)}];
 const s=calculate(work,monitors,events);
 assert.equal(s.attendanceSeconds,3500);assert.equal(s.monitoringSeconds,1200);
 assert.equal(s.activeSeconds,350);assert.equal(s.idleSeconds,100);assert.equal(s.unclassifiedSeconds,750);
});
test('missing activity is unclassified; duplicate application intervals do not double count',()=>{
 const work={checkIn:at(0),checkOut:at(100)};const monitoring=[{intervals:[{start:at(0),end:at(100)}]}];
 const event={type:'application',application:'Editor',start:at(0),end:at(50)};
 const s=calculate(work,monitoring,[event,event]);assert.equal(s.applications.Editor,50);assert.equal(s.activeSeconds,0);assert.equal(s.unclassifiedSeconds,100);
 assert.deepEqual(union([{start:at(100),end:at(0)}]),[]);
});
test('overnight sessions use UTC elapsed time',()=>{
 const s=calculate({checkIn:new Date('2026-10-13T23:00:00Z'),checkOut:new Date('2026-10-14T02:00:00Z')},[],[]);
 assert.equal(s.attendanceSeconds,10800);assert.equal(s.monitoringSeconds,0);
});
