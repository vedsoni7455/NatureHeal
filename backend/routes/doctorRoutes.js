import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';

// Controllers
import {
  getDoctors,
  getDoctorById,
  updateDoctorProfile,
  getDoctorAppointments,
  getDoctorStats,
  getDoctorAvailability,
  updateDoctorAvailability,
  getDoctorPatients,
  getPatientDetails,
  getDoctorSlots,
} from '../controllers/doctorController.js';

router.get('/', getDoctors);
router.get('/:id/slots', getDoctorSlots);
router.get('/:id', getDoctorById);
router.put('/profile', protect, updateDoctorProfile);

// Doctor-only routes
router.get('/appointments', protect, getDoctorAppointments);
router.get('/stats', protect, getDoctorStats);
router.get('/availability', protect, getDoctorAvailability);
router.put('/availability', protect, updateDoctorAvailability);

// Patient management routes
router.get('/patients', protect, getDoctorPatients);
router.get('/patients/:patientId', protect, getPatientDetails);

export default router;
