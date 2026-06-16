import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/authController.js';
import { registerRules, loginRules, validate } from '../middleware/validationMiddleware.js';

router.post('/register', registerRules, validate, registerUser);
router.post('/login', loginRules, validate, loginUser);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
