import express from "express";

import {
  assignTeam,
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.route("/").get(getProjects).post(createProject);
router.post("/:id/team", assignTeam);
router
  .route("/:id")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

export default router;
