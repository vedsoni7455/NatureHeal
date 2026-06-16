import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

// Basic check for environment variables
if (!process.env.MONGO_URI || !process.env.GROQ_API_KEY) {
  console.warn('⚠️  Warning: MONGO_URI or GROQ_API_KEY is missing from environment');
}

// Initialize Express app before startServer (fixes hoisting bug)
const app = express();

// Middlewares
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : null;
    const allowedOrigins = [
      frontendUrl,
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
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
app.use('/uploads', express.static('uploads'));

// Rate limiting for AI routes (prevents API cost overruns)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'Too many AI requests, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', generalLimiter);

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
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);
app.use("/api/wellness-hub", aiLimiter, aiRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);

// Basic test route
app.get("/", (req, res) => {
  res.send("🌿 Healora Backend API Running Successfully!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Connect MongoDB & Start Server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🌱 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
