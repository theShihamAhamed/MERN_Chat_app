import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  getProfile,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// router.use(arcjetProtection);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", verifyToken, updateProfile);

router.get("/profile", verifyToken, getProfile);

export default router;
