import express from "express";
import { create, deleteProject, list, overview, startSession, updateProject } from "../controllers/practiceLabController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.use(protect);
router.get("/overview", overview); router.post("/sessions", startSession);
router.route("/:resource").get(list).post(create);
router.route("/projects/:id").put(updateProject).delete(deleteProject);
export default router;
