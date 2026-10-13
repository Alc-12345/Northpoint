import express from "express";

import { login, register } from "../controllers/authController.js";
import { logoutHandler } from "./monitoringRoutes.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", optionalAuth, register);
router.post("/login", login);
router.post("/logout", protect, logoutHandler);

export default router;
