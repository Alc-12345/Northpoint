import express from "express";
import Task from "../models/Task.js";
import { employeeFor } from "../services/monitoring.js";
import rateLimit from "express-rate-limit";

import { protect, requireAdmin } from "../middleware/authMiddleware.js";

import {
  addWorkUpdate,
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.use(protect, rateLimit({windowMs:60000,limit:120}));
router.post("/:id/work", protect, addWorkUpdate);
router.get("/me", protect, async (req, res) => {
  const employee = await employeeFor(req.user);
  res.json(await Task.find({ assignedTo: { $in: [String(employee._id), String(req.user._id), employee.email, employee.username, req.user.username].filter(Boolean) } }));
});
router.patch("/:id", protect, async (req, res) => {
  const employee = await employeeFor(req.user);
  if (!["Pending", "In Progress", "Completed"].includes(req.body.status)) return res.status(400).json({message:"Valid task status required"});
  const task = await Task.findOneAndUpdate({ _id: req.params.id, assignedTo: { $in: [String(employee._id), String(req.user._id), employee.email, employee.username, req.user.username].filter(Boolean) } }, { $set: { status: req.body.status, completedAt: req.body.status === "Completed" ? new Date() : null }, $push: { updateHistory: { actor: req.user._id, status: req.body.status, at: new Date() } } }, {new:true,runValidators:true});
  if (!task) return res.status(404).json({message:"Assigned task not found"});
  res.json(task);
});

router.route("/").get(getTasks).post(requireAdmin, createTask);
router.route("/:id").get(getTaskById).put(requireAdmin, updateTask).delete(requireAdmin, deleteTask);

export default router;
