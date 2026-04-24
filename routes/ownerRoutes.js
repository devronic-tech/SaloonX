import express from "express";
import upload from "../middleware/cloudUpload.js";
import authMid from "../middleware/authMid.js";

import {
registerOwner,
verifyOwnerOtp,
loginOwner,
updateOwnerProfile
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
router.put("/update-profile", authMid, updateOwnerProfile);

export default router
