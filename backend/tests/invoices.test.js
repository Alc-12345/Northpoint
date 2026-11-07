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
