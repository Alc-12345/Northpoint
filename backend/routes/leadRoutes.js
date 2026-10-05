import express from "express";

import {
  createLead,
  deleteLead,
  convertLeadToProject,
  getLeadById,
  getLeads,
  updateLead,
} from "../controllers/leadController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, requireAdmin, createLead)
  .get(protect, requireAdmin, getLeads);
router.post("/:id/convert", protect, requireAdmin, convertLeadToProject);
router
  .route("/:id")
  .get(protect, requireAdmin, getLeadById)
  .put(protect, requireAdmin, updateLead)
  .delete(protect, requireAdmin, deleteLead);

export default router;
