import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';

// Controllers
import {
  getDoctors,
  getDoctorById,
  updateDoctorProfile,
} from '../controllers/doctorController.js';

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.put('/profile', protect, updateDoctorProfile);

export default router;
