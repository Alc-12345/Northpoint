import express from "express";

import {
  getWorkflow,
  runWorkflow,
  saveWorkflow,
} from "../controllers/etlController.js";

const router = express.Router();

router.route("/workflow").get(getWorkflow).post(saveWorkflow);
router.post("/run", runWorkflow);

export default router;
