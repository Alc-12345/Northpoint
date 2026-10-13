import { test } from 'node:test';
import assert from 'node:assert/strict';
import { executeWorkflow, parseSourceFile } from '../shared/etlEngine.js';
import { mathFunctions, sqlFunctions } from '../shared/etlFunctions.js';

const run = (rows, type, config = {}) => executeWorkflow([
  { id: 'source', data: { category: 'source', type: 'json-file', sourceRows: rows } },
  { id: 'operation', data: { category: 'transform', type, ...config } },
  { id: 'output', data: { category: 'output', type: 'output' } },
], [{ source: 'source', target: 'operation' }, { source: 'operation', target: 'output' }]).outputRows;
const config = (functionName, extra = {}) => ({ functionName, functionColumn: 'value', resultColumn: 'result', ...extra });

const sqlCases = [
  ['upper', ' Abc ', ' ABC ', {}],
  ['lower', ' AbC ', ' abc ', {}],
  ['trim', ' Abc ', 'Abc', {}],
  ['length', 'a😀b', 3, {}],
  ['concat', 'abc', 'abcxyz', { operandValue: 'xyz' }],
  ['coalesce', null, 'fallback', { operandValue: 'fallback' }],
  ['nullif', 'missing', null, { operandValue: 'missing' }],
  ['replace', 'a-a', 'b-b', { searchText: 'a', replacementText: 'b' }],
  ['substring', 'abcdef', 'bcd', { substringStart: 2, substringLength: 3 }],
];
assert.deepEqual(sqlCases.map(c => c[0]).sort(), sqlFunctions.map(f => f.value).sort());
for (const [fn, value, expected, options] of sqlCases) {
  test(`SQL ${fn} processes uploaded rows and preserves other columns`, () => {
    const rows = parseSourceFile(JSON.stringify([{ id: 1, value }]), 'json-file');
    assert.deepEqual(run(rows, 'sql-function', config(fn, options)), [{ id: 1, value, result: expected }]);
  });
}

const mathCases = [
  ['add', '7', 2, 9], ['subtract', '7', 2, 5], ['multiply', '7', 2, 14],
  ['divide', '7', 2, 3.5], ['modulo', '7', 2, 1], ['power', '7', 2, 49],
  ['abs', '-7', undefined, 7], ['round', '7.126', undefined, 7.13],
  ['floor', '-7.1', undefined, -8], ['ceil', '-7.1', undefined, -7], ['sqrt', '49', undefined, 7],
];
assert.deepEqual(mathCases.map(c => c[0]).sort(), mathFunctions.map(f => f.value).sort());
for (const [fn, value, operandValue, expected] of mathCases) {
  test(`math ${fn} processes numeric CSV cells`, () => {
    const rows = parseSourceFile(`value,id\n${value},1`, 'csv');
    assert.deepEqual(run(rows, 'math', config(fn, { operandValue, precision: 2 })), [{ value, id: '1', result: expected }]);
  });
}

for (const fn of mathFunctions.filter(f => f.args.includes('operand'))) {
  test(`math ${fn.value} accepts a second column`, () => {
    const expected = mathCases.find(c => c[0] === fn.value)[3];
    assert.equal(run([{ value: 7, other: '2' }], 'math', config(fn.value, { operandMode: 'column', operandColumn: 'other' }))[0].result, expected);
  });
}
for (const [fn, expected] of [['concat', 'x!'], ['coalesce', '!'], ['nullif', 'x']]) {
  test(`SQL ${fn} accepts a second column`, () => {
    assert.equal(run([{ value: fn === 'coalesce' ? null : 'x', other: '!' }], 'sql-function', config(fn, { operandMode: 'column', operandColumn: 'other' }))[0].result, expected);
  });
}

test('NULL handling, empty strings, overwriting a column and substring bounds', () => {
  for (const fn of ['upper', 'lower', 'trim', 'length', 'replace', 'substring']) {
    assert.equal(run([{ value: null }], 'sql-function', config(fn, { searchText: 'x' }))[0].result, null);
  }
  assert.equal(run([{ value: '' }], 'sql-function', config('coalesce', { operandValue: 'fallback' }))[0].result, '');
  assert.equal(run([{ value: 'x' }], 'sql-function', config('nullif', { operandValue: 'y' }))[0].result, 'x');
  assert.equal(run([{ value: null }], 'sql-function', config('concat', { operandValue: 'x' }))[0].result, 'x');
  assert.equal(run([{ value: null }], 'math', config('add', { operandValue: 2 }))[0].result, null);
  assert.deepEqual(run([{ value: 'abc' }], 'sql-function', config('upper', { resultColumn: 'value' })), [{ value: 'ABC' }]);
  for (const [options, expected] of [[{ substringStart: 2 }, 'bc'], [{ substringStart: 9 }, ''], [{ substringLength: 0 }, ''], [{ substringStart: 2, substringLength: 1 }, 'b']]) {
    assert.equal(run([{ value: 'abc' }], 'sql-function', config('substring', options))[0].result, expected);
  }
});

test('functions reject missing columns, invalid numeric values and invalid configuration', () => {
  const invalid = [
    ['math', 'divide', { operandValue: 0 }, /zero/],
    ['math', 'modulo', { operandValue: 0 }, /zero/],
    ['math', 'sqrt', {}, /nonnegative/],
    ['math', 'power', { operandValue: 10000 }, /finite/],
    ['math', 'round', { precision: 11 }, /integer/],
    ['math', 'add', { operandValue: 'abc' }, /finite/],
    ['math', 'add', { operandValue: 1, functionColumn: 'missing' }, /does not exist/],
    ['math', 'add', { operandMode: 'column', operandColumn: 'missing' }, /does not exist/],
    ['math', 'unknown', {}, /Unknown/],
    ['sql-function', 'replace', {}, /search text/],
    ['sql-function', 'substring', { substringStart: 0 }, /integer/],
    ['sql-function', 'substring', { substringLength: -1 }, /integer/],
    ['sql-function', 'upper', { resultColumn: '' }, /result columns/],
  ];
  for (const [type, fn, options, pattern] of invalid) {
    const value = fn === 'sqrt' ? -1 : fn === 'power' ? 100 : 7;
    assert.throws(() => run([{ value }], type, config(fn, options)), pattern);
  }
  for (const value of ['', 'abc', true, {}, 'Infinity']) assert.throws(() => run([{ value }], 'math', config('add', { operandValue: 1 })), /finite/);
  assert.throws(() => run([{ value: 4, divisor: 0 }], 'math', config('divide', { operandMode: 'column', operandColumn: 'divisor' })), /zero/);
});

test('SQL and math chain from CSV through filter, aggregation and output', () => {
  const sourceRows = parseSourceFile('team,price,quantity\n a ,10,2\n a ,5,3\n b ,1,1', 'csv');
  const nodes = [
    { id: 's', data: { category: 'source', type: 'csv', sourceRows } },
    { id: 'trim', data: { category: 'transform', type: 'sql-function', ...config('trim', { functionColumn: 'team', resultColumn: 'team' }) } },
    { id: 'math', data: { category: 'transform', type: 'math', ...config('multiply', { functionColumn: 'price', operandMode: 'column', operandColumn: 'quantity', resultColumn: 'total' }) } },
    { id: 'f', data: { category: 'transform', type: 'filter', filterColumn: 'total', filterOperator: 'gt', filterValue: 5 } },
    { id: 'g', data: { category: 'combine', type: 'aggregate', groupBy: 'team', aggregateFunction: 'sum', aggregateColumn: 'total' } },
    { id: 'o', data: { category: 'output', type: 'preview' } },
  ];
  const ids = nodes.map(n => n.id);
  const edges = ids.slice(1).map((target, i) => ({ source: ids[i], target }));
  assert.deepEqual(executeWorkflow(nodes, edges).outputRows, [{ team: 'a', sum: 35 }]);
});

for (const [operator, expected] of [['eq', [2]], ['ne', [1, 3]], ['contains', [2]], ['gt', [3]], ['gte', [2, 3]], ['lt', [1]], ['lte', [1, 2]]]) {
  test(`filter ${operator}`, () => {
    assert.deepEqual(run([1, 2, 3].map(value => ({ value })), 'filter', { filterColumn: 'value', filterOperator: operator, filterValue: 2 }).map(r => r.value), expected);
  });
}

test('union DISTINCT, inner join and all empty global aggregates', () => {
  const s = { id: 's', data: { category: 'source', sourceRows: [{ id: 1 }] } };
  const t = { id: 't', data: { category: 'source', sourceRows: [{ id: 1 }, { id: 2 }] } };
  const o = { id: 'o', data: { category: 'output', type: 'output' } };
  const edges = [{ source: 's', target: 'c' }, { source: 't', target: 'c' }, { source: 'c', target: 'o' }];
  assert.deepEqual(executeWorkflow([s, t, { id: 'c', data: { category: 'combine', type: 'union', unionDistinct: true } }, o], edges).outputRows, [{ id: 1 }, { id: 2 }]);
  assert.deepEqual(executeWorkflow([s, t, { id: 'c', data: { category: 'combine', type: 'join', leftInput: 's', leftKey: 'id', rightKey: 'id', joinType: 'inner' } }, o], edges).outputRows, [{ id: 1, 'right.id': 1 }]);
  for (const fn of ['count', 'sum', 'avg', 'min', 'max']) {
    assert.deepEqual(run([], 'aggregate', { aggregateFunction: fn, aggregateColumn: 'amount' }), [{ [fn]: ['count', 'sum'].includes(fn) ? 0 : null }]);
  }
});

test('all progress card types retain their status, progress and work hours during data runs', async () => {
  const { operationGroups } = await import('../../frontend/src/utils/etlConfig.js');
  const nodes = ['frontend', 'backend', 'server'].flatMap(category => operationGroups[category].operations.map(op => ({
    id: op.type, data: { category, type: op.type, status: 'Running', progress: 25, totalWorkingHours: 4 },
  })));
  assert.deepEqual(executeWorkflow(nodes, []).nodes, nodes);
});

test('every offered SQL/math function handles empty input without fabricated rows', () => {
  for (const [type, definitions] of [['sql-function', sqlFunctions], ['math', mathFunctions]]) {
    for (const fn of definitions) {
      assert.deepEqual(run([], type, config(fn.value, { operandValue: 2, searchText: 'a' })), []);
    }
  }
});
