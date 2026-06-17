import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "../backend/config/db.js";

// Import routes (reuse existing ones)
import authRoutes from "../backend/routes/authRoutes.js";
import userRoutes from "../backend/routes/userRoutes.js";
import doctorRoutes from "../backend/routes/doctorRoutes.js";
import appointmentRoutes from "../backend/routes/appointmentRoutes.js";
import adminRoutes from "../backend/routes/adminRoutes.js";
import aiRoutes from "../backend/routes/aiRoutes.js";
import dietRoutes from "../backend/routes/dietRoutes.js";
import contactRoutes from "../backend/routes/contactRoutes.js";
import uploadRoutes from "../backend/routes/uploadRoutes.js";

const app = express();

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS – allow any origin (or tighten later)
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rate limiting
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'Too many AI requests, try again later.' },
});
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use('/api/', generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Healora API running', status: 'OK' });
});

app.use((err, req, res, next) => {
  console.error('SERVER_ERROR:', err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (e) {
    console.error('Failed to start', e);
    process.exit(1);
  }
};

startServer();

// Export for Vercel – Vercel will call this handler for every request
export default (req, res) => {
  app(req, res);
};
