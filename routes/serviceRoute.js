import express from "express";
import upload from "../middleware/cloudUpload.js";
import {
createService,
getServices,
updateService,
getAllServices,
getService
} from "../controllers/serviceController.js";

import authMiddleware from "../middleware/authMid.js";

const router = express.Router();

router.get("/all-services", getAllServices);
router.get("/get-services", authMiddleware, getServices);
router.get("/:id", getService);
router.put("/update-service/:id", authMiddleware, updateService);
router.post(
  "/create-service",
  authMiddleware,
  (req, res, next) => {
    upload.single("serviceImg")(req, res, (err) => {
      if (err) {
        console.error("Multer/Cloudinary error:", err);
        return res.status(500).json({ 
          message: "Image upload failed", 
          error: err.message 
        });
      }
      next();
    });
  },
  createService
);


export default router
