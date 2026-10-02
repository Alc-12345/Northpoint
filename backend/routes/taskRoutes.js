import express from "express";

import { optionalAuth, protect } from "../middleware/authMiddleware.js";

import {
  addWorkUpdate,
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.use(optionalAuth);
router.post("/:id/work", protect, addWorkUpdate);

router.route("/").get(getTasks).post(createTask);
router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

export default router;
