import express from "express";
import upload from "../middleware/upload.js";
import {
createService,
getServices
} from "../controllers/serviceController.js";

import authMiddleware from "../middleware/authMid.js";

const router = express.Router();
router.post(
"/create-service",
authMiddleware,
upload.single("serviceImg"),
createService
)

router.post(
"/get-services",
authMiddleware,
getServices
)

export default router
