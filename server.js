import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import sequelize from "./config/database.js";
import createDatabase from "./scripts/initDb.js";

import "./models/User.js";
import "./models/otpModel.js";

import authRoutes from "./routes/User.js";

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





// Health Check
app.get("/health", (req, res) => {
 res.status(200).json({
  status: "OK",
  message: "Backend is running"
 });
});


// Start Server
async function startServer() {
 try {

  // Create DB
  await createDatabase();

  // Connect DB
  await sequelize.authenticate();
  console.log("Database connected successfully");

  // Sync Models
  await sequelize.sync({ alter: true });
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