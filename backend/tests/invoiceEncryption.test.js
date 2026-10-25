import { test } from "node:test";
import assert from "node:assert/strict";
import { encryptInvoice, decryptInvoice } from "../utils/invoiceEncryption.js";

test("financial envelopes round-trip, randomize ciphertext and reject tampering", () => {
  process.env.INVOICE_ENCRYPTION_KEY = "cd".repeat(32);
  const invoice = { invoiceNumber: "INV-1", total: 123, items: [{ rate: 123, quantity: 1, amount: 123 }] };
  const encrypted = encryptInvoice(invoice);
  assert.equal(encrypted.total, undefined);
  assert.equal(encrypted.items, undefined);
  assert.deepEqual(decryptInvoice(encrypted), invoice);
  assert.notEqual(encrypted.financialData, encryptInvoice(invoice).financialData);
  assert.throws(() => decryptInvoice({ ...encrypted, invoiceNumber: "INV-2" }));
  process.env.INVOICE_ENCRYPTION_KEY = "ef".repeat(32);
  assert.throws(() => decryptInvoice(encrypted));
  delete process.env.INVOICE_ENCRYPTION_KEY;
  assert.throws(() => encryptInvoice(invoice), /INVOICE_ENCRYPTION_KEY/);
});
