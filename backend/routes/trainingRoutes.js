import express from "express";
import { create, list, overview, remove, update } from "../controllers/trainingController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.use(protect);
router.get("/overview", overview);
router.route("/:collection").get(list).post(create);
router.route("/:collection/:id").put(update).delete(remove);
export default router;
