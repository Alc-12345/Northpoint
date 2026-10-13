import { applyRowFunction } from "./etlFunctions.js";

export const isProgressNode = (data = {}) => Boolean(data.taskId) || ['frontend', 'backend', 'server'].includes(data.category);

export function parseSourceFile(text, type) {
  if (type === 'json-file') {
    const rows = JSON.parse(text);
    if (!Array.isArray(rows) || rows.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('JSON must contain an array of row objects.');
    return rows;
  }
  const records = [];
  let record = [], cell = '', quoted = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
      else if (quoted || cell === '') quoted = !quoted;
      else throw new Error('Invalid CSV quoting.');
    } else if (!quoted && (ch === ',' || ch === '\n' || ch === '\r')) {
      record.push(cell); cell = '';
      if (ch !== ',') {
        if (record.some(value => value !== '')) records.push(record);
        record = [];
        if (ch === '\r' && text[i + 1] === '\n') i++;
      }
    } else cell += ch;
  }
  if (quoted) throw new Error('Unclosed CSV quote.');
  if (cell || record.length) { record.push(cell); records.push(record); }
  if (!records.length) throw new Error('The file is empty.');
  const headers = records.shift();
  if (headers.some(h => !h.trim()) || new Set(headers).size !== headers.length) throw new Error('CSV headers must be nonempty and unique.');
  return records.map(values => {
    if (values.length !== headers.length) throw new Error('CSV row has a different number of columns than its headers.');
    return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  });
}

const columns = value => String(value || '').split(',').map(v => v.trim()).filter(Boolean);
const requireField = (value, name) => { if (!value) throw new Error(`Configure ${name}.`); return value; };
const checkColumn = (rows, column) => {
  requireField(column, 'column');
  if (rows.length && !rows.some(row => Object.hasOwn(row, column))) throw new Error(`Column "${column}" does not exist.`);
};

export function executeWorkflow(nodes = [], edges = []) {
  const dataNodes = nodes.filter(n => !isProgressNode(n.data));
  const byId = new Map(dataNodes.map(n => [n.id, n]));
  const results = new Map(), visiting = new Set();
  for (const edge of edges) {
    if (!nodes.some(n => n.id === edge.source) || !nodes.some(n => n.id === edge.target)) throw new Error('Connection references a missing node.');
    if (byId.has(edge.source) !== byId.has(edge.target)) throw new Error('Progress cards cannot connect to data operations.');
  }
  const visit = id => {
    if (results.has(id)) return results.get(id);
    if (visiting.has(id)) throw new Error('Workflow contains a cycle.');
    visiting.add(id);
    const node = byId.get(id), d = node.data || {};
    const incoming = edges.filter(e => e.target === id);
    const inputs = incoming.map(e => visit(e.source));
    let rows;
    if (d.category === 'source') {
      if (inputs.length) throw new Error('Source cards cannot have incoming data.');
      if (!Array.isArray(d.sourceRows)) throw new Error(`${d.label || id}: upload and save a CSV or JSON file first.`);
      rows = d.sourceRows;
    } else {
      const multi = ['join', 'union'].includes(d.type);
      if ((!multi && inputs.length !== 1) || (multi && inputs.length < 2)) throw new Error(`${d.label || id}: connect ${multi ? 'at least two sources' : 'one input'}.`);
      const input = inputs[0];
      switch (d.type) {
        case 'sql-function': case 'math': rows = applyRowFunction(input, d); break;
        case 'filter': {
          checkColumn(input, d.filterColumn);
          const operators = {
            eq: v => String(v ?? '') === String(d.filterValue ?? ''),
            ne: v => String(v ?? '') !== String(d.filterValue ?? ''),
            contains: v => String(v ?? '').includes(String(d.filterValue ?? '')),
            gt: v => Number(v) > Number(d.filterValue),
            gte: v => Number(v) >= Number(d.filterValue),
            lt: v => Number(v) < Number(d.filterValue),
            lte: v => Number(v) <= Number(d.filterValue),
          };
          const predicate = operators[d.filterOperator || 'eq'];
          if (!predicate) throw new Error('Unknown filter operator.');
          rows = input.filter(row => predicate(row[d.filterColumn])); break;
        }
        case 'select': {
          const selected = columns(requireField(d.selectColumns, 'columns to select'));
          selected.forEach(c => checkColumn(input, c));
          let renames = {};
          if (d.renameColumns) renames = JSON.parse(d.renameColumns);
          if (!renames || typeof renames !== 'object' || Array.isArray(renames) || Object.values(renames).some(v => typeof v !== 'string' || !v)) throw new Error('Renames must map column names to nonempty new names.');
          if (new Set(selected.map(c => renames[c] || c)).size !== selected.length) throw new Error('Renamed columns must be unique.');
          rows = input.map(row => Object.fromEntries(selected.map(c => [renames[c] || c, row[c]]))); break;
        }
        case 'join': {
          if (inputs.length !== 2) throw new Error('Join requires exactly two inputs.');
          const leftIndex = incoming.findIndex(e => e.source === d.leftInput);
          if (leftIndex < 0) throw new Error('Choose the left input for the join.');
          const left = inputs[leftIndex], right = inputs[1 - leftIndex];
          checkColumn(left, d.leftKey); checkColumn(right, d.rightKey);
          if (!['inner', 'left'].includes(d.joinType || 'inner')) throw new Error('Unknown join type.');
          const rightColumns = [...new Set(right.flatMap(row => Object.keys(row)))];
          rows = left.flatMap(l => {
            const matches = l[d.leftKey] == null ? [] : right.filter(r => r[d.rightKey] != null && String(l[d.leftKey]) === String(r[d.rightKey]));
            const merge = r => ({ ...l, ...Object.fromEntries(rightColumns.map(c => [Object.hasOwn(l, c) ? `right.${c}` : c, r?.[c] ?? null])) });
            return matches.length ? matches.map(merge) : d.joinType === 'left' ? [merge(null)] : [];
          }); break;
        }
        case 'union': {
          const all = inputs.flat();
          const headers = [...new Set(all.flatMap(row => Object.keys(row)))];
          rows = all.map(row => Object.fromEntries(headers.map(c => [c, row[c] ?? null])));
          if (d.unionDistinct) { const seen = new Set(); rows = rows.filter(row => { const key = JSON.stringify(row); if (seen.has(key)) return false; seen.add(key); return true; }); }
          break;
        }
        case 'aggregate': {
          const groups = columns(d.groupBy);
          groups.forEach(c => checkColumn(input, c));
          const fn = d.aggregateFunction || 'count';
          if (!['count', 'sum', 'avg', 'min', 'max'].includes(fn)) throw new Error('Unknown aggregation.');
          if (fn !== 'count') checkColumn(input, d.aggregateColumn);
          const buckets = new Map();
          for (const row of input) { const key = JSON.stringify(groups.map(c => row[c] ?? null)); if (!buckets.has(key)) buckets.set(key, []); buckets.get(key).push(row); }
          if (!groups.length && !input.length) buckets.set('[]', []);
          const alias = d.aggregateAlias || fn;
          if (groups.includes(alias)) throw new Error('Result column must differ from grouping columns.');
          rows = [...buckets.values()].map(bucket => {
            const values = bucket.map(r => Number(r[d.aggregateColumn]));
            if (fn !== 'count' && bucket.some(r => r[d.aggregateColumn] == null || r[d.aggregateColumn] === '' || !Number.isFinite(Number(r[d.aggregateColumn])))) throw new Error('Aggregation needs numeric values.');
            const sum = values.reduce((a, b) => a + b, 0);
            const result = fn === 'count' ? bucket.length : fn === 'sum' ? sum : !values.length ? null : fn === 'avg' ? sum / values.length : values.reduce((a, b) => fn === 'min' ? Math.min(a, b) : Math.max(a, b));
            return { ...Object.fromEntries(groups.map(c => [c, bucket[0]?.[c] ?? null])), [alias]: result };
          }); break;
        }
        case 'preview': case 'output': rows = input; break;
        default: throw new Error(`${d.label || id}: choose a supported data operation.`);
      }
    }
    visiting.delete(id); results.set(id, rows); return rows;
  };
  dataNodes.forEach(n => visit(n.id));
  const completed = nodes.map(n => isProgressNode(n.data) ? n : ({ ...n, data: { ...n.data, status: 'Completed', progress: 100, outputRows: results.get(n.id) } }));
  return { nodes: completed, edges, outputRows: completed.filter(n => n.data?.category === 'output').flatMap(n => n.data.outputRows), message: 'Workflow completed' };
}
