import { ApiCollection, CodingChallenge, CodingSession, Dataset, GitSession, PracticeProject, PracticeStatistic, SqlQuery } from "../models/PracticeLab.js";

const models = { projects: PracticeProject, challenges: CodingChallenge, queries: SqlQuery, datasets: Dataset, collections: ApiCollection, git: GitSession };
const managerRoles = ["superadmin", "admin", "trainer"];
const modelFor = (name) => models[name];

export const overview = async (req, res) => {
  const stats = await PracticeStatistic.findOneAndUpdate({ user: req.user._id }, { $setOnInsert: { user: req.user._id } }, { new: true, upsert: true });
  const projects = await PracticeProject.find({ owner: req.user._id }).sort({ updatedAt: -1 }).limit(6);
  res.json({ stats, projects });
};
export const list = async (req, res) => { const Model = modelFor(req.params.resource); if (!Model) return res.status(404).json({ message: "Unknown practice resource" }); const filter = req.params.resource === "challenges" ? {} : { $or: [{ owner: req.user._id }, { user: req.user._id }] }; res.json(await Model.find(filter).sort({ updatedAt: -1 })); };
export const create = async (req, res) => {
  const Model = modelFor(req.params.resource); if (!Model) return res.status(404).json({ message: "Unknown practice resource" });
  if (req.params.resource === "challenges" && !managerRoles.includes(req.user.role)) return res.status(403).json({ message: "Only trainers and administrators can create challenges" });
  const ownerField = ["projects", "datasets", "collections"].includes(req.params.resource) ? "owner" : req.params.resource === "challenges" ? "createdBy" : "user";
  res.status(201).json(await Model.create({ ...req.body, [ownerField]: req.user._id }));
};
export const updateProject = async (req, res) => { const project = await PracticeProject.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, { ...req.body, $inc: { version: 1 } }, { new: true, runValidators: true }); if (!project) return res.status(404).json({ message: "Project not found" }); res.json(project); };
export const deleteProject = async (req, res) => { const project = await PracticeProject.findOneAndDelete({ _id: req.params.id, owner: req.user._id }); if (!project) return res.status(404).json({ message: "Project not found" }); res.json({ message: "Project deleted" }); };
export const startSession = async (req, res) => res.status(201).json(await CodingSession.create({ ...req.body, user: req.user._id }));
