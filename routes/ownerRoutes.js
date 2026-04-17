import express from "express";
import upload from "../middleware/upload.js";

import {
registerOwner,
verifyOwnerOtp,
loginOwner
} from "../controllers/ownerController.js";

const router = express.Router();

router.post(
  "/register-owner",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "background", maxCount: 1 }
  ]),
  registerOwner
)

router.post("/verify-owner-otp", verifyOwnerOtp)

router.post("/login-owner",loginOwner)

export default router
