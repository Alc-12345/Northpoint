import express from "express";

import {
  createLead,
  deleteLead,
  convertLeadToProject,
  getLeadById,
  getLeads,
  updateLead,
} from "../controllers/leadController.js";
import { protect, requireSuperadmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(createLead).get(protect, requireSuperadmin, getLeads);
router.post("/:id/convert", protect, requireSuperadmin, convertLeadToProject);
router
  .route("/:id")
  .get(protect, requireSuperadmin, getLeadById)
  .put(protect, requireSuperadmin, updateLead)
  .delete(protect, requireSuperadmin, deleteLead);

export default router;
