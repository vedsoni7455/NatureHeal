import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Debug: Check env vars again after imports
console.log('After imports - MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
console.log('After imports - GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Set' : 'Not set');

// Check if env vars are available before connecting
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not set in environment variables');
  process.exit(1);
}

// Connect MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middlewares
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS Configuration for Production Readiness
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Allow specific frontend URL or all in dev
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import dietRoutes from "./routes/dietRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Use routes
app.use("/api/auth", authRoutes);             // Register/Login
app.use("/api/user", userRoutes);             // Profile CRUD
app.use("/api/doctor", doctorRoutes);         // Doctor management
app.use("/api/appointments", appointmentRoutes); // Book/manage appointments
app.use("/api/admin", adminRoutes);           // Admin analytics
app.use("/api/ai", aiRoutes);                 // AI chatbot
app.use("/api/diet", dietRoutes);             // Diet plans
app.use("/api/diet", dietRoutes);             // Diet plans
app.use("/api/contact", contactRoutes);       // Contact form
app.use("/api/upload", uploadRoutes);         // File upload

// Basic test route
app.get("/", (req, res) => {
  res.send("🌿 Healing Roots Backend API Running Successfully!");
});

// Error handling middleware (optional, for later)
// catch all errors
app.use((err, req, res, next) => {
  console.error(err.stack); // log error to console (Render logs will capture it)
  res.status(500).json({ message: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌱 Server running on http://localhost:${PORT}`);
});
