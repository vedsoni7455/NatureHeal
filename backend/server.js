import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Basic check for environment variables
if (!process.env.MONGO_URI || !process.env.GROQ_API_KEY) {
  console.warn('⚠️  Warning: MONGO_URI or GROQ_API_KEY is missing from environment');
}

// Connect MongoDB & Start Server
const startServer = async () => {
  try {
    await connectDB();

    // Start server only after DB is ready
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🌱 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Initialize Express app
const app = express();

// Middlewares
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS Configuration for Production Readiness
const corsOptions = {
  origin: function (origin, callback) {
    // List of allowed origins
    const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : null;
    const allowedOrigins = [frontendUrl, 'http://localhost:3000'].filter(Boolean);

    // If no origin (like server-to-server) or origin is in allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // In development, if FRONTEND_URL is not set, allow everything (but reflect origin for credentials)
      if (!process.env.FRONTEND_URL) {
        callback(null, true);
      } else {
        console.error(`CORS Blocked: Origin ${origin} not in allowed list:`, allowedOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
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
app.use("/api/ai", aiRoutes);                 // Legacy AI routes
app.use("/api/wellness-hub", aiRoutes);        // Modern Wellness Hub routes
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

startServer();
