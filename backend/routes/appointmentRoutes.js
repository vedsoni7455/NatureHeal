import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

// Controllers
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointmentController.js';

router
  .route('/')
  .get(protect, getAppointments)
  .post(protect, upload.single('report'), createAppointment);
router
  .route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, updateAppointment)
  .delete(protect, deleteAppointment);

export default router;
