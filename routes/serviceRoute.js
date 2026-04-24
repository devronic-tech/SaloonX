import express from "express";
import upload from "../middleware/cloudUpload.js";
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

router.get(
"/get-services",
authMiddleware,
getServices
)

export default router
