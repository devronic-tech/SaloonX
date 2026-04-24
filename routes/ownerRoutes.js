import express from "express";
import upload from "../middleware/cloudUpload.js";
import authMid from "../middleware/authMid.js";

import {
registerOwner,
verifyOwnerOtp,
loginOwner,
updateOwnerProfile,
getOwnerProfile,
getAllSalons
} from "../controllers/ownerController.js";

const router = express.Router();

router.get("/all-salons", getAllSalons);

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
router.put(
  "/update-profile", 
  authMid, 
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "background", maxCount: 1 },
    { name: "salon_image", maxCount: 10 }
  ]),
  updateOwnerProfile
);
router.get("/get-profile", authMid, getOwnerProfile);

export default router
