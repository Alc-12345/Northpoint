import { test } from "node:test";
import assert from "node:assert/strict";
import { previewInvoiceApi as api } from "./previewInvoices.js";
import { startPanelPreview, clearAuthSession } from "./auth.js";
import { defaultSettings } from "../../../backend/shared/invoices.js";
const storage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
};
globalThis.localStorage = storage();
globalThis.sessionStorage = storage();
const data = () => ({
  ...structuredClone(defaultSettings),
  invoiceNumber: "PREVIEW-001",
  invoiceDate: "2026-10-16",
  dueDate: "2026-10-23",
  client: { name: "Preview Client" },
  items: [{ description: "Services", quantity: 3, rate: 3100 }],
  taxPercentage: 15,
  status: "Draft",
});
test("tokenless admin preview supports isolated invoice CRUD, defaults, validation and cleanup", () => {
  startPanelPreview("admin");
  assert.equal(localStorage.getItem("authToken"), null);
  assert.deepEqual(api.getAll(), []);
  assert.deepEqual(api.getSettings(), defaultSettings);
  const created = api.create({ ...data(), total: 1 });
  assert.equal(created.total, 10695);
  assert.equal(api.getById(created._id).invoiceNumber, "PREVIEW-001");
  assert.throws(() => api.create(data()), /already exists/);
  assert.throws(() => api.create({ ...data(), items: [] }), /invoice items/);
  const updated = api.update(created._id, { ...created, status: "Paid" });
  assert.equal(updated.status, "Paid");
  assert.equal(updated.createdAt, created.createdAt);
  api.saveSettings({
    ...defaultSettings,
    paymentDetails: {
      ...defaultSettings.paymentDetails,
      accountNumber: "123456789",
    },
  });
  assert.equal(api.getSettings().paymentDetails.accountNumber, "123456789");
  assert.equal(
    api.getById(created._id).paymentDetails.accountNumber,
    "2602220017926460",
  );
  api.remove(created._id);
  assert.deepEqual(api.getAll(), []);
  assert.throws(() => api.getById(created._id), /not found/);
  api.create(data());
  clearAuthSession();
  assert.equal(sessionStorage.getItem("northpoint.preview.invoices"), null);
  assert.equal(
    sessionStorage.getItem("northpoint.preview.invoiceSettings"),
    null,
  );
});
test("non-admin previews and non-preview sessions cannot access the preview store", () => {
  for (const role of ["client", "employee", "hr"]) {
    startPanelPreview(role);
    for (const action of [
      () => api.getAll(),
      () => api.getSettings(),
      () => api.create(data()),
      () => api.saveSettings(defaultSettings),
    ])
      assert.throws(action, /administrator preview/);
  }
  clearAuthSession();
  localStorage.setItem("authUser", JSON.stringify({ role: "admin" }));
  assert.throws(() => api.getAll(), /administrator preview/);
});
