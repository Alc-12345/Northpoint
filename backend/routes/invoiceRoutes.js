import express from "express";
import Invoice from "../models/Invoice.js";
import InvoiceSettings from "../models/InvoiceSettings.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
import {
  calculate,
  defaultSettings,
  validateInvoice,
} from "../shared/invoices.js";
import { encryptInvoice, decryptInvoice, plaintextFinancialFields } from "../utils/invoiceEncryption.js";
const router = express.Router();
router.use(protect, requireAdmin);
router.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
router.get("/settings", async (req, res) =>
  res.json(
    (await InvoiceSettings.findOne({ key: "company" }))?.values ||
      defaultSettings,
  ),
);
router.put("/settings", async (req, res) => {
  const values = pick(req.body, [
    "company",
    "paymentDetails",
    "termsAndConditions",
    "paymentTerms",
    "dueDays",
    "taxPercentage",
  ]);
  const errors = validateInvoice({
    ...values,
    invoiceNumber: "SETTINGS",
    invoiceDate: "2026-01-01",
    dueDate: "2026-01-01",
    client: { name: "Settings" },
    items: [{ description: "Settings", quantity: 1, rate: 0 }],
    status: "Draft",
  });
  if (errors.length) return res.status(400).json({ errors });
  await InvoiceSettings.findOneAndUpdate(
    { key: "company" },
    { $set: { values } },
    { upsert: true, runValidators: true },
  );
  res.json(values);
});
router.get("/", async (req, res) =>
  res.json((await Invoice.find().sort({ createdAt: -1 })).map(decryptInvoice)),
);
router.get("/:id", async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });
  res.json(decryptInvoice(invoice));
});
function pick(data, keys) {
  data = data && typeof data === "object" ? data : {};
  return Object.fromEntries(
    keys
      .filter((key) => Object.hasOwn(data, key))
      .map((key) => [key, data[key]]),
  );
}
function payload(body) {
  const data = pick(body, [
    "invoiceNumber",
    "invoiceDate",
    "dueDate",
    "company",
    "client",
    "referenceNumber",
    "paymentTerms",
    "dueDays",
    "items",
    "taxPercentage",
    "paymentDetails",
    "termsAndConditions",
    "status",
  ]);
  return { data, errors: validateInvoice(data) };
}
router.post("/", async (req, res) => {
  const { data, errors } = payload(req.body);
  if (errors.length) return res.status(400).json({ errors });
  res.status(201).json(
    decryptInvoice(await Invoice.create(encryptInvoice({
      ...data,
      ...calculate(data.items, data.taxPercentage),
      createdBy: req.user._id,
      updatedBy: req.user._id,
    }))),
  );
});
router.put("/:id", async (req, res) => {
  const { data, errors } = payload(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const invoice = await Invoice.findByIdAndUpdate(
    req.params.id,
    {
      $unset: plaintextFinancialFields,
      $set: encryptInvoice({
        ...data,
        ...calculate(data.items, data.taxPercentage),
        updatedBy: req.user._id,
      }),
    },
    { returnDocument: "after", runValidators: true },
  );
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });
  res.json(decryptInvoice(invoice));
});
router.delete("/:id", async (req, res) => {
  if (!(await Invoice.findByIdAndDelete(req.params.id)))
    return res.status(404).json({ message: "Invoice not found" });
  res.json({ message: "Invoice deleted" });
});
export default router;
