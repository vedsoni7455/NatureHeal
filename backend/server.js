import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

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

const app = express();

// Basic check for environment variables
if (!process.env.MONGO_URI || !process.env.GROQ_API_KEY) {
  console.warn('⚠️  Warning: MONGO_URI or GROQ_API_KEY is missing from environment');
}

// 1. Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// 2. Manual & Robust CORS Handling
const allowedOrigins = [
  'https://healora-wine.vercel.app',
  'https://healora-five.vercel.app',
  'http://localhost:3000',
  process.env.FRONTEND_URL?.replace(/\/$/, "")
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin) {
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  } else {
    // For requests without origin (like direct browser navigation or server-to-server)
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// 3. Built-in Middlewares
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 4. Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/wellness-hub", aiRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);

// Basic test route
app.get("/", (req, res) => {
  res.json({ message: "🌿 Healing Roots Backend API Running Successfully!", status: "OK" });
});

// 5. Error handling
app.use((err, req, res, next) => {
  console.error('SERVER_ERROR:', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 6. Connect MongoDB & Start Server
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
