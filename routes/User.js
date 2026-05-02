import express from "express";
import { register, verifyOtp ,login, getUserProfile } from "../controllers/User.js";
import authMiddleware from "../middleware/authMid.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.get("/profile", authMiddleware, getUserProfile);

export default router;