import express from "express";

import {
  createLead,
  deleteLead,
  getLeadById,
  getLeads,
  updateLead,
} from "../controllers/leadController.js";
import { protect, requireSuperadmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(createLead).get(protect, requireSuperadmin, getLeads);
router
  .route("/:id")
  .get(protect, requireSuperadmin, getLeadById)
  .put(protect, requireSuperadmin, updateLead)
  .delete(protect, requireSuperadmin, deleteLead);

export default router;
