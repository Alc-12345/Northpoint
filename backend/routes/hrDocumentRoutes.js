import express from "express";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
import HrDocument from "../models/HrDocument.js";
import Intern from "../models/Intern.js";
import OfferEmployee from "../models/OfferEmployee.js";
import { documentTypes, validateDocument } from "../shared/hrDocuments.js";

const router = express.Router();
router.use(protect, (req, res, next) => {
  if (!["admin", "superadmin", "hr"].includes(req.user.role)) return res.status(403).json({ message: "HR documents are available to administrators and HR staff" });
  next();
});
router.get("/interns", async (req, res) => {
  res.json(await Intern.find().sort({ createdAt: -1 }));
});
router.post("/interns", requireAdmin, async (req, res) => {
  const data = {};
  for (const key of ["candidateName", "role", "companyName"]) {
    if (typeof req.body[key] !== "string" || !req.body[key].trim() || req.body[key].trim().length > 120) return res.status(400).json({ message: `${key} is required and must be at most 120 characters` });
    data[key] = req.body[key].trim();
  }
  const { startDate, duration } = req.body;
  if (typeof startDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !Number.isFinite(Date.parse(startDate)) || new Date(startDate).toISOString().slice(0, 10) !== startDate) return res.status(400).json({ message: "Enter a valid internship start date" });
  if (!["3", "6"].includes(duration)) return res.status(400).json({ message: "Choose a 3-month or 6-month duration" });
  res.status(201).json(await Intern.create({ ...data, startDate, duration, createdBy: req.user._id }));
});
router.get("/offer-employees", async (req, res) => {
  res.json(await OfferEmployee.find().sort({ createdAt: -1 }));
});
router.post("/offer-employees", requireAdmin, async (req, res) => {
  const data = {};
  for (const key of ["candidateName", "role", "companyName"]) {
    if (typeof req.body[key] !== "string" || !req.body[key].trim() || req.body[key].trim().length > 120) return res.status(400).json({ message: `${key} is required and must be at most 120 characters` });
    data[key] = req.body[key].trim();
  }
  const { startDate, employmentType } = req.body;
  if (typeof startDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !Number.isFinite(Date.parse(startDate)) || new Date(startDate).toISOString().slice(0, 10) !== startDate) return res.status(400).json({ message: "Enter a valid employment start date" });
  if (!["Full-time", "Part-time", "Contract"].includes(employmentType)) return res.status(400).json({ message: "Choose a valid employment type" });
  res.status(201).json(await OfferEmployee.create({ ...data, startDate, employmentType, createdBy: req.user._id }));
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
