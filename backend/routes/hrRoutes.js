import express from "express";
import { getHrSummary } from "../controllers/hrController.js";

const router = express.Router();

router.get("/", getHrSummary);

export default router;
