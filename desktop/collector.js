export function stateEvent(start, end, idleSeconds, key) {
  if (!start || end <= start) return null;
  return { key, type: idleSeconds >= 60 ? 'idle' : 'active', start: new Date(start).toISOString(), end: new Date(end).toISOString(), source: 'desktop' };
}
export function permittedQueue(events, session, now = Date.now()) {
  if (!session || session.status !== 'active') return [];
  return events.filter(e => new Date(e.start) >= new Date(session.start) && new Date(e.end) <= now && now-new Date(e.end) < 3600000);
}
