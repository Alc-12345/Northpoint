import { test } from 'node:test';
import assert from 'node:assert/strict';
import router from '../routes/invoiceRoutes.js';
import Invoice from '../models/Invoice.js';
import { defaultSettings } from '../shared/invoices.js';
import { invoiceResponse } from '../../frontend/src/utils/invoiceResponse.js';

test('invoice save returns a table-compatible invoice when locked and unlocked', async (t) => {
  const previousKey = process.env.INVOICE_ENCRYPTION_KEY;
  process.env.INVOICE_ENCRYPTION_KEY = 'a'.repeat(64);
  t.after(() => {
    if (previousKey === undefined) delete process.env.INVOICE_ENCRYPTION_KEY;
    else process.env.INVOICE_ENCRYPTION_KEY = previousKey;
  });
  t.mock.method(Invoice, 'create', async data => new Invoice(data));
  const save = router.stack.find(layer => layer.route?.path === '/' && layer.route.methods.post).route.stack[0].handle;
  for (const unlocked of [false, true]) {
    let status, body;
    await save({
      amountsUnlocked: unlocked,
      user: { _id: '507f1f77bcf86cd799439011' },
      body: { ...structuredClone(defaultSettings), invoiceNumber: 'INV-001', invoiceDate: '2026-11-07', dueDate: '2026-11-14', client: { name: 'Client' }, status: 'Draft', items: [{ description: 'Services', quantity: 1, rate: 100 }] },
    }, {
      status(value) { status = value; return this; },
      json(value) { body = JSON.parse(JSON.stringify(value)); },
    });
    assert.equal(status, 201);
    assert.doesNotThrow(() => invoiceResponse(body));
    assert.equal(body.amountsLocked, !unlocked);
    assert.equal(body.financialData, undefined);
    if (unlocked) assert.equal(body.total, 100);
    else assert.equal(body.total, undefined);
  }
});

test('invalid encryption configuration fails before writing or setting success status', async (t) => {
  const previousKey = process.env.INVOICE_ENCRYPTION_KEY;
  process.env.INVOICE_ENCRYPTION_KEY = 'invalid';
  t.after(() => {
    if (previousKey === undefined) delete process.env.INVOICE_ENCRYPTION_KEY;
    else process.env.INVOICE_ENCRYPTION_KEY = previousKey;
  });
  const create = t.mock.method(Invoice, 'create', async () => { throw new Error('unexpected database write'); });
  const save = router.stack.find(layer => layer.route?.path === '/' && layer.route.methods.post).route.stack[0].handle;
  let status = 200;
  await assert.rejects(save({
    user: { _id: '507f1f77bcf86cd799439011' },
    body: { ...structuredClone(defaultSettings), invoiceNumber: 'INV-FAIL', invoiceDate: '2026-11-07', dueDate: '2026-11-14', client: { name: 'Client' }, status: 'Draft', items: [{ description: 'Services', quantity: 1, rate: 100 }] },
  }, { status(value) { status = value; return this; } }), /INVOICE_ENCRYPTION_KEY/);
  assert.equal(status, 200);
  assert.equal(create.mock.callCount(), 0);
});

test('error handler never returns a success HTTP status for an error', async () => {
  const { default: errorHandler } = await import('../middleware/errorHandler.js');
  for (const statusCode of [200, 201, 204, 304, 400, 403, 500]) {
    let actual;
    errorHandler(new Error('Configuration error'), {}, {
      statusCode,
      status(value) { actual = value; return this; },
      json(body) { assert.equal(body.message, 'Configuration error'); },
    }, () => {});
    assert.equal(actual, statusCode >= 400 ? statusCode : 500);
  }
});
