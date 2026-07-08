import express from "express";

import { login, register } from "../controllers/authController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", optionalAuth, register);
router.post("/login", login);

export default router;
