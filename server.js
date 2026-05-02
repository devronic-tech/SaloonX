import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";

import sequelize, { switchToLocal } from "./config/database.js";
import createDatabase from "./scripts/initDb.js";

import "./models/User.js";
import "./models/otpModel.js";
import "./models/ownerModel.js";
import "./models/ownerOtp.js";
import "./models/salonModel.js";
import "./models/Service.js";
import "./models/Booking.js";

import authRoutes from "./routes/User.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import serviceRoute from "./routes/serviceRoute.js";
import salonRoutes from "./routes/salonRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 CREATE HTTP SERVER
const server = http.createServer(app);

// 🔥 SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// make io available in controllers
app.set("io", io);

// 🔥 SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // owner joins their room
  socket.on("join-owner", (ownerId) => {
    socket.join(`owner_${ownerId}`);
    console.log(`Owner joined room: owner_${ownerId}`);
  });

  // user joins their room
  socket.on("join-user", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User joined room: user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});


// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug logger
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/service", serviceRoute);
app.use("/api/salon", salonRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/admin", adminRoutes);

// Health
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend is running"
  });
});


// START SERVER
async function startServer() {
  const isUsingUrl = !!process.env.DB_URL;

  try {
    if (isUsingUrl) {
      try {
        await sequelize.authenticate();
        console.log("Connected to Remote DB");
      } catch {
        switchToLocal();
        await createDatabase();
        await sequelize.authenticate();
        console.log("Connected to Local DB");
      }
    } else {
      await createDatabase();
      await sequelize.authenticate();
      console.log("Connected to Local DB");
    }

    await sequelize.sync({ force: false, alter: true });
    console.log("Models synced");

    // ❌ REMOVE app.listen
    // ✅ USE server.listen
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server start error:", error);
    process.exit(1);
  }
}

startServer();