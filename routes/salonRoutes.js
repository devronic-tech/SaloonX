import express from "express"
import upload from "../middleware/cloudUpload.js"
import authMiddleware from "../middleware/authMid.js"
import { createSalon } from "../controllers/salonController.js"
import { searchEverything } from "../controllers/searchController.js"

const router = express.Router()

router.get("/search", searchEverything);

router.post(
"/create-salon",
authMiddleware,
upload.array("salon_image",5),
createSalon
)

export default router