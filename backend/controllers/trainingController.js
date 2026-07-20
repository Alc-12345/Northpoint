import crypto from "node:crypto";
import { Assignment, Batch, Certificate, CodingProblem, Course, LiveClass, Quiz, Resource } from "../models/Training.js";

const models = { courses: Course, batches: Batch, classes: LiveClass, assignments: Assignment, problems: CodingProblem, resources: Resource, quizzes: Quiz, certificates: Certificate };
const getModel = (key) => models[key];
const populate = "trainer students course batch uploadedBy student";

export const list = async (req, res) => {
  const Model = getModel(req.params.collection); if (!Model) return res.status(404).json({ message: "Unknown training collection" });
  res.json(await Model.find().populate(populate).sort({ createdAt: -1 }));
};
export const create = async (req, res) => {
  const Model = getModel(req.params.collection); if (!Model) return res.status(404).json({ message: "Unknown training collection" });
  const payload = req.params.collection === "certificates" && !req.body.certificateId ? { ...req.body, certificateId: `NP-TMS-${Date.now()}`, qrToken: crypto.randomUUID() } : req.body;
  res.status(201).json(await Model.create(payload));
};
export const update = async (req, res) => {
  const Model = getModel(req.params.collection); if (!Model) return res.status(404).json({ message: "Unknown training collection" });
  const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: "Training item not found" }); res.json(item);
};
export const remove = async (req, res) => {
  const Model = getModel(req.params.collection); if (!Model) return res.status(404).json({ message: "Unknown training collection" });
  const item = await Model.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ message: "Training item not found" }); res.json({ message: "Deleted" });
};
export const overview = async (req, res) => {
  const [courses, batches, assignments, classes, students, certificates] = await Promise.all([Course.countDocuments(), Batch.countDocuments(), Assignment.countDocuments(), LiveClass.countDocuments({ startsAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } }), Course.aggregate([{ $project: { count: { $size: "$students" } } }, { $group: { _id: null, total: { $sum: "$count" } } }]), Certificate.countDocuments()]);
  res.json({ courses, batches, assignments, todaysClasses: classes, students: students[0]?.total || 0, certificates });
};
