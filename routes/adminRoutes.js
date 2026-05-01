import express from "express";
import { getAdminStats } from "../controllers/adminStatsController.js";

const router = express.Router();

// GET /api/admin/stats
router.get("/stats", getAdminStats);

export default router;
