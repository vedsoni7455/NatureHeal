import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';

// Controllers
import {
  getDietPlans,
  getDietPlan,
  createDietPlan,
  generateDietPlan,
  updateDietPlan,
  deleteDietPlan,
  addProgress,
  updateRoutine,
  getProgress,
} from '../controllers/dietController.js';

router.get('/', protect, getDietPlans);
router.get('/:id', protect, getDietPlan);
router.post('/', protect, createDietPlan);
router.post('/generate', protect, generateDietPlan);
router.put('/:id', protect, updateDietPlan);
router.put('/:id/routine', protect, updateRoutine);
router.delete('/:id', protect, deleteDietPlan);
router.post('/:id/progress', protect, addProgress);
router.get('/:id/progress', protect, getProgress);

export default router;
