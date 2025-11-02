// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Load env
dotenv.config();

// Connect MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// Use routes
app.use("/api/auth", authRoutes);             // Register/Login
app.use("/api/user", userRoutes);             // Profile CRUD
app.use("/api/doctor", doctorRoutes);         // Doctor management
app.use("/api/appointments", appointmentRoutes); // Book/manage appointments
app.use("/api/admin", adminRoutes);           // Admin analytics
app.use("/api/ai", aiRoutes);                 // AI chatbot

// Basic test route
app.get("/", (req, res) => {
  res.send("🌿 Healing Roots Backend API Running Successfully!");
});

// Error handling middleware (optional, for later)
import { errorHandler } from "./middleware/errorMiddleware.js";
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌱 Server running on http://localhost:${PORT}`);
});
