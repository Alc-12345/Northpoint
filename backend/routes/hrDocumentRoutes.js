import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import HrDocument from "../models/HrDocument.js";
import { documentTypes, validateDocument } from "../../shared/hrDocuments.js";

const router = express.Router();
router.use(protect, (req, res, next) => {
  if (!["admin", "superadmin", "hr"].includes(req.user.role)) return res.status(403).json({ message: "HR documents are available to administrators and HR staff" });
  next();
});
router.get("/:type", async (req, res) => {
  if (!Object.hasOwn(documentTypes, req.params.type)) return res.status(400).json({ message: "Unknown document type" });
  res.json(await HrDocument.find({ type: req.params.type }).sort({ createdAt: -1 }));
});
const payload = (req, res) => {
  const { type } = req.params;
  const { values, items = [], template } = req.body;
  const errors = validateDocument(type, values, items, template);
  if (errors.length) { res.status(400).json({ errors }); return null; }
  return { type, values: Object.fromEntries(documentTypes[type].fields.map(field => [field.key, values[field.key] ?? ""])), template, items: type === "quotation" ? items.map(({ description, quantity, rate }) => ({ description, quantity: Number(quantity), rate: Number(rate) })) : [] };
};
router.post("/:type", async (req, res) => {
  const data = payload(req, res);
  if (data) res.status(201).json(await HrDocument.create({ ...data, createdBy: req.user._id }));
});
router.put("/:type/:id", async (req, res) => {
  const data = payload(req, res);
  if (!data) return;
  const document = await HrDocument.findOneAndUpdate({ _id: req.params.id, type: req.params.type }, { $set: data }, { returnDocument: "after", runValidators: true });
  if (!document) return res.status(404).json({ message: "Document not found" });
  res.json(document);
});
export default router;
