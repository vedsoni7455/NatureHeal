import express from 'express';
const router = express.Router();
import { protect, admin } from '../middleware/authMiddleware.js';

// Controllers
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  saveRemedy,
  getSavedRemedies,
  deleteSavedRemedy,
} from '../controllers/userController.js';

router.route('/').get(protect, admin, getUsers);
router
  .route('/saved-remedies')
  .post(protect, saveRemedy)
  .get(protect, getSavedRemedies);

router.route('/saved-remedies/:id').delete(protect, deleteSavedRemedy);

router
  .route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;
