import express from "express";
import { getAdminStats } from "../controllers/adminStatsController.js";
import authMid from "../middleware/authMid.js";

const router = express.Router();

// GET /api/admin/stats
router.get("/stats", authMid, getAdminStats);

export default router;
