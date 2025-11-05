import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';

// Controllers
import {
  chatWithAI,
  getChatHistory,
  generateAIDietPlan,
  generateAIHealthInsights,
  getHealthPredictions
} from '../controllers/aiController.js';

router.post('/chat', chatWithAI);
router.get('/history', protect, getChatHistory);
router.post('/generate-diet', protect, generateAIDietPlan);
router.post('/health-insights', protect, generateAIHealthInsights);
router.post('/health-predictions', protect, getHealthPredictions);

export default router;
