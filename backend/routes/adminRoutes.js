import express from 'express';
const router = express.Router();
import { protect, admin } from '../middleware/authMiddleware.js';

// Controllers
import {
  getDashboardStats,
  getAllUsers,
  getAllAppointments,
} from '../controllers/adminController.js';

router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.get('/appointments', protect, admin, getAllAppointments);

export default router;
