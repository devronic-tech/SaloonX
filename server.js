import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import sequelize, { switchToLocal } from "./config/database.js";
import createDatabase from "./scripts/initDb.js";

import "./models/User.js";
import "./models/otpModel.js";
import "./models/ownerModel.js";
import "./models/ownerOtp.js";
import "./models/salonModel.js";

import authRoutes from "./routes/User.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import serviceRoute from "./routes/serviceRoute.js"
import salonRoutes from "./routes/salonRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/service",serviceRoute)
app.use("/api/salon", salonRoutes);





// Health Check
app.get("/health", (req, res) => {
 res.status(200).json({
  status: "OK",
  message: "Backend is running"
 });
});


// Start Server
async function startServer() {
  const isUsingUrl = !!process.env.DB_URL;
  
  try {
    if (isUsingUrl) {
      console.log("Attempting to connect to Remote Database (DB_URL)...");
      try {
        await sequelize.authenticate();
        console.log("Connected to Remote Database successfully.");
      } catch (urlError) {
        console.error("Remote Database connection failed:", urlError.message);
        switchToLocal();
        await createDatabase();
        await sequelize.authenticate();
        console.log("Connected to Local Database successfully (Fallback).");
      }
    } else {
      console.log("Using Local Database configuration.");
      await createDatabase();
      await sequelize.authenticate();
      console.log("Connected to Local Database successfully.");
    }

    // Sync Models
    await sequelize.sync({ force: false, alter: true });
    console.log("Models synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server start error:", error);
    process.exit(1);
  }
}

startServer();