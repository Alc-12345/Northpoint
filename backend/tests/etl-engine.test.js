import { test } from 'node:test';
import assert from 'node:assert/strict';
import { executeWorkflow, parseSourceFile } from '../shared/etlEngine.js';
const node = (id, category, type, data = {}) => ({ id, data: { category, type, ...data } });
const edge = (source, target) => ({ source, target });

test('CSV stores actual rows, including quoted commas and multiline values; JSON validates rows', () => {
  assert.deepEqual(parseSourceFile('id,name\r\n1,"A,B"\r\n2,"A\nB"', 'csv'), [{ id: '1', name: 'A,B' }, { id: '2', name: 'A\nB' }]);
  assert.throws(() => parseSourceFile('id,id\n1,2', 'csv'), /unique/);
  assert.throws(() => parseSourceFile('[1]', 'json-file'), /objects/);
});

test('connected filter and reshape produce real output and preserve progress cards', () => {
  const progress = node('work', 'backend', 'rest-api', { progress: 45, status: 'Running', totalWorkingHours: 2 });
  const nodes = [node('s', 'source', 'csv', { sourceRows: [{ name: 'A', amount: '10' }, { name: 'B', amount: '2' }] }), node('f', 'transform', 'filter', { filterColumn: 'amount', filterOperator: 'gt', filterValue: '5' }), node('r', 'transform', 'select', { selectColumns: 'name', renameColumns: '{"name":"customer"}' }), node('o', 'output', 'preview'), progress];
  const result = executeWorkflow(nodes, [edge('s', 'f'), edge('f', 'r'), edge('r', 'o')]);
  assert.deepEqual(result.outputRows, [{ customer: 'A' }]);
  assert.deepEqual(result.nodes.at(-1), progress);
});

test('joins respect selected left input and union and aggregation consume upstream rows', () => {
  const sources = [node('a', 'source', 'csv', { sourceRows: [{ id: '1', team: 'A' }, { id: '2', team: 'B' }] }), node('b', 'source', 'csv', { sourceRows: [{ id: '1', amount: '3' }, { id: '1', amount: '4' }] })];
  const joined = executeWorkflow([...sources, node('j', 'combine', 'join', { leftInput: 'a', leftKey: 'id', rightKey: 'id', joinType: 'left' }), node('o', 'output', 'output')], [edge('b', 'j'), edge('a', 'j'), edge('j', 'o')]);
  assert.equal(joined.outputRows.length, 3);
  assert.equal(joined.outputRows[2].amount, null);
  assert.equal(joined.outputRows[0]['right.id'], '1');
  for (const [fn, expected] of [['sum', 7], ['avg', 3.5], ['min', 3], ['max', 4], ['count', 2]]) {
    const result = executeWorkflow([sources[1], node('g', 'combine', 'aggregate', { groupBy: 'id', aggregateFunction: fn, aggregateColumn: 'amount' }), node('o', 'output', 'output')], [edge('b', 'g'), edge('g', 'o')]);
    assert.equal(result.outputRows[0][fn], expected);
  }
  const union = executeWorkflow([...sources, node('u', 'combine', 'union'), node('o', 'output', 'output')], [edge('a', 'u'), edge('b', 'u'), edge('u', 'o')]);
  assert.equal(union.outputRows.length, 4);
  assert.equal(union.outputRows[0].amount, null);
});

test('empty results remain empty and invalid graphs/configuration fail honestly', () => {
  const source = node('s', 'source', 'csv', { sourceRows: [] });
  assert.deepEqual(executeWorkflow([source, node('o', 'output', 'preview')], [edge('s', 'o')]).outputRows, []);
  assert.throws(() => executeWorkflow([node('s', 'source', 'csv')]), /upload/);
  assert.throws(() => executeWorkflow([node('o', 'output', 'preview')], [edge('o', 'o')]), /cycle/);
  assert.throws(() => executeWorkflow([source, node('o', 'output', 'preview')]), /one input/);
  assert.throws(() => executeWorkflow([source, node('w', 'server', 'deployment')], [edge('s', 'w')]), /Progress/);
});
