export function union(intervals) {
  const sorted = intervals.map(({ start, end }) => [Number(new Date(start)), Number(new Date(end))]).filter(([a,b]) => Number.isFinite(a) && b > a).sort((a,b) => a[0]-b[0]);
  const result = [];
  for (const [a,b] of sorted) {
    const last = result.at(-1);
    if (last && a <= last[1]) last[1] = Math.max(last[1], b);
    else result.push([a,b]);
  }
  return result;
}
const seconds = (ranges) => ranges.reduce((n,[a,b]) => n+(b-a)/1000,0);
export function intersect(a,b) {
  return a.flatMap(([s,e]) => b.map(([x,y]) => [Math.max(s,x),Math.min(e,y)]).filter(([x,y]) => y>x));
}
export function calculate(work, monitoring, events, now = new Date()) {
  const end = work.checkOut || now;
  const attendance = union([{ start: work.checkIn, end }]);
  const breaks = intersect(attendance, union((work.breaks || []).map(i=>({start:i.start,end:i.end||end}))));
  const windows = union(monitoring.flatMap(m => m.intervals.map(i => {
    let boundary = i.end || m.stop || end;
    if (m.authorizationExpiresAt) boundary = new Date(Math.min(+new Date(boundary), +new Date(m.authorizationExpiresAt)));
    if (!i.end && m.os && m.os !== 'browser' && m.lastHeartbeat && +now - +new Date(m.lastHeartbeat) > 60000) boundary = new Date(Math.min(+new Date(boundary), +new Date(m.lastHeartbeat)));
    return { start: i.start, end: boundary };
  }))); 
  const allowed = intersect(attendance, windows);
  const active = union(intersect(allowed, union(events.filter(e => e.type==='active').map(e=>e))).map(([start,end])=>({start,end})));
  const idle = union(intersect(allowed, union(events.filter(e => e.type==='idle').map(e=>e))).map(([start,end])=>({start,end})));
  // Conflicting signals are unknown, never counted twice.
  const conflict = seconds(intersect(active,idle));
  const monitoringSeconds = seconds(allowed);
  const activeSeconds = seconds(active)-conflict;
  const idleSeconds = seconds(idle)-conflict;
  const breakdown = (type, field) => events.filter(e=>e.type===type).reduce((out,e) => {
    const key = e[field] || 'uncategorized';
    (out[key] ||= []).push(...intersect(allowed, union([e])));
    return out;
  }, {});
  const aggregate = (data) => {
    const entries = Object.entries(data).map(([key,ranges]) => [key, union(ranges.map(([start,end])=>({start,end})))]);
    const edges = [...new Set(entries.flatMap(([,ranges])=>ranges.flat()))].sort((a,b)=>a-b);
    const totals = {};
    for (let i=1;i<edges.length;i++) {
      const start=edges[i-1],end=edges[i];
      const matches=entries.filter(([,ranges])=>ranges.some(([a,b])=>a<=start&&b>=end));
      if(matches.length===1)totals[matches[0][0]]=(totals[matches[0][0]]||0)+(end-start)/1000;
      else if(matches.length>1)totals.unknown=(totals.unknown||0)+(end-start)/1000;
    }
    return totals;
  };
  return { attendanceSeconds: Math.max(0,seconds(attendance)-seconds(breaks)), monitoringSeconds, activeSeconds, idleSeconds,
    unclassifiedSeconds: Math.max(0,monitoringSeconds-activeSeconds-idleSeconds), applications: aggregate(breakdown('application','application')), websites: aggregate(breakdown('website','category')) };
}
