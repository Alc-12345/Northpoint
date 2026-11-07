import { test } from "node:test";
import assert from "node:assert/strict";
import { invoiceResponse, invoiceListResponse } from "./invoiceResponse.js";

const invoice = { _id: "saved-invoice", invoiceNumber: "INV-001", client: { name: "Client" }, items: [{ description: "Services" }], total: 100 };

test("saved and updated invoices remain usable by the invoice table", () => {
  assert.deepEqual(invoiceResponse(invoice), invoice);
  assert.deepEqual(invoiceListResponse([invoice]), [invoice]);
});

test("locked responses without financial items can be rendered safely", () => {
  const { items, ...locked } = invoice;
  const result = invoiceResponse({ ...locked, amountsLocked: true });
  assert.deepEqual(result.items, []);
  assert.equal(result.amountsLocked, true);
});

test("unexpected save responses fail before entering table state", () => {
  for (const data of [null, "", { message: "Saved" }, { ...invoice, client: null }, { ...invoice, items: undefined }]) {
    assert.throws(() => invoiceResponse(data), /check whether it was saved/);
  }
  assert.throws(() => invoiceListResponse({ invoices: [invoice] }), /invalid invoice list/);
});

test("save acknowledgements recover the persisted invoice without another write", async () => {
  const { savedInvoiceResponse } = await import('./invoiceResponse.js');
  let reads = 0;
  const saved = await savedInvoiceResponse({ message: 'Saved' }, { invoiceNumber: ' INV-001 ' }, async () => {
    reads++;
    return [invoice];
  });
  assert.deepEqual(saved, invoice);
  assert.equal(reads, 1);
});

test("updates recover by ID and valid save responses need no read", async () => {
  const { savedInvoiceResponse } = await import('./invoiceResponse.js');
  assert.deepEqual(await savedInvoiceResponse(null, { _id: invoice._id }, async () => [invoice]), invoice);
  assert.deepEqual(await savedInvoiceResponse(invoice, invoice, async () => { throw new Error('unexpected read'); }), invoice);
});

test("read-back failures and absent invoices do not report a successful save", async () => {
  const { savedInvoiceResponse } = await import('./invoiceResponse.js');
  await assert.rejects(savedInvoiceResponse(null, invoice, async () => []), /invalid invoice/);
  await assert.rejects(savedInvoiceResponse(null, invoice, async () => { throw new Error('Offline'); }), /Offline/);
});
