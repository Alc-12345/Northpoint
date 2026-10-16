import { isPanelPreview } from "./auth.js";
import { canUseFinance } from "./financeAccess.js";
import {
  calculate,
  defaultSettings,
  validateInvoice,
} from "../../../backend/shared/invoices.js";
const invoiceKey = "northpoint.preview.invoices";
const settingsKey = "northpoint.preview.invoiceSettings";
function authorize() {
  if (!isPanelPreview() || !canUseFinance())
    throw new Error(
      "Invoice previews are available only in the administrator preview panel.",
    );
}
function read(key, fallback) {
  authorize();
  return JSON.parse(sessionStorage.getItem(key) || JSON.stringify(fallback));
}
function write(key, value) {
  authorize();
  sessionStorage.setItem(key, JSON.stringify(value));
  return structuredClone(value);
}
function validated(data) {
  const errors = validateInvoice(data);
  if (errors.length) throw new Error(errors.join(", "));
  return {
    ...structuredClone(data),
    ...calculate(data.items, data.taxPercentage),
  };
}
function getAll() {
  const rows = read(invoiceKey, []);
  if (!Array.isArray(rows))
    throw new Error("Invalid preview invoices. Start a new preview session.");
  return rows;
}
function getById(id) {
  const invoice = getAll().find((row) => row._id === id);
  if (!invoice) throw new Error("Invoice not found");
  return invoice;
}
function save(data, id) {
  authorize();
  const rows = getAll();
  const existing = id ? getById(id) : null;
  const invoice = validated(data);
  if (
    rows.some(
      (row) => row.invoiceNumber === invoice.invoiceNumber && row._id !== id,
    )
  )
    throw new Error("Invoice number already exists.");
  const now = new Date().toISOString();
  const saved = {
    ...invoice,
    _id: id || crypto.randomUUID(),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    createdBy: "preview-admin",
    updatedBy: "preview-admin",
  };
  write(invoiceKey, [saved, ...rows.filter((row) => row._id !== id)]);
  return saved;
}
export const previewInvoiceApi = {
  getAll,
  getById,
  create: (data) => save(data),
  update: (id, data) => save(data, id),
  remove: (id) => {
    getById(id);
    write(
      invoiceKey,
      getAll().filter((row) => row._id !== id),
    );
    return { message: "Invoice deleted" };
  },
  getSettings: () => read(settingsKey, defaultSettings),
  saveSettings: (values) => {
    authorize();
    validated({
      ...values,
      invoiceNumber: "SETTINGS",
      invoiceDate: "2026-01-01",
      dueDate: "2026-01-01",
      client: { name: "Settings" },
      items: [{ description: "Settings", quantity: 1, rate: 0 }],
      status: "Draft",
    });
    return write(
      settingsKey,
      Object.fromEntries(
        [
          "company",
          "paymentDetails",
          "termsAndConditions",
          "paymentTerms",
          "dueDays",
          "taxPercentage",
        ].map((key) => [key, values[key]]),
      ),
    );
  },
};
