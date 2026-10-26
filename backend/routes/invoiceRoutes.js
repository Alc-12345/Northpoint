import { randomBytes, scrypt as deriveKey, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import InvoiceAccess from "../models/InvoiceAccess.js";
const scrypt = promisify(deriveKey);
const accessSecret = () => process.env.JWT_SECRET || "dev_jwt_secret_change_me";
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
// Grants are short lived, user-bound and never replace normal admin authorization.
router.use((req, res, next) => {
  try {
    const grant = jwt.verify(req.get("X-Invoice-Unlock") || "", accessSecret(), { audience: "invoice-amounts" });
    req.amountsUnlocked = grant.sub === String(req.user._id) && grant.version === (req.user.tokenVersion || 0);
  } catch { req.amountsUnlocked = false; }
  next();
});
const passwordLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });
router.get("/amount-access", async (req, res) => {
  res.json({ configured: Boolean(await InvoiceAccess.exists({ _id: "amount-password" })) });
});
router.post("/amount-access/setup", passwordLimit, async (req, res) => {
  const { password } = req.body;
  if (typeof password !== "string" || password.length < 12 || password.length > 128)
    return res.status(400).json({ message: "Use a password of 12–128 characters" });
  const salt = randomBytes(16).toString("hex");
  const hash = (await scrypt(password, salt, 64)).toString("hex");
  try {
    await InvoiceAccess.create({ _id: "amount-password", salt, hash, createdBy: req.user._id });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "The invoice password has already been set and cannot be changed" });
    throw error;
  }
  res.status(201).json({ configured: true });
});
router.post("/amount-access/unlock", passwordLimit, async (req, res) => {
  const access = await InvoiceAccess.findById("amount-password").select("+salt +hash");
  if (!access) return res.status(409).json({ message: "An administrator must set the invoice password first" });
  const { password } = req.body;
  if (typeof password !== "string" || password.length > 128 || !timingSafeEqual(await scrypt(password, access.salt, 64), Buffer.from(access.hash, "hex")))
    return res.status(403).json({ message: "Incorrect invoice password" });
  const token = jwt.sign({ version: req.user.tokenVersion || 0 }, accessSecret(), { subject: String(req.user._id), audience: "invoice-amounts", expiresIn: "15m" });
  res.json({ token, expiresIn: 900 });
});
function visibleInvoice(invoice, req) {
  if (req.amountsUnlocked) return { ...decryptInvoice(invoice), amountsLocked: false };
  const data = invoice.toObject ? invoice.toObject() : { ...invoice };
  for (const field of [...Object.keys(plaintextFinancialFields), "financialData"]) delete data[field];
  return { ...data, items: [], amountsLocked: true };
}
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
  res.json((await Invoice.find().sort({ createdAt: -1 })).map(invoice => visibleInvoice(invoice, req))),
);
router.get("/:id", async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });
  res.json(visibleInvoice(invoice, req));
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
    visibleInvoice(await Invoice.create(encryptInvoice({
      ...data,
      ...calculate(data.items, data.taxPercentage),
      createdBy: req.user._id,
      updatedBy: req.user._id,
    })), req),
  );
});
router.put("/:id", async (req, res) => {
  if (!req.amountsUnlocked) return res.status(403).json({ message: "Decrypt invoice amounts before editing" });
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
  res.json(visibleInvoice(invoice, req));
});
router.delete("/:id", async (req, res) => {
  if (!(await Invoice.findByIdAndDelete(req.params.id)))
    return res.status(404).json({ message: "Invoice not found" });
  res.json({ message: "Invoice deleted" });
});
export default router;
