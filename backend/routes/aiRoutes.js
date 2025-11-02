import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';

// Controllers
import { chatWithAI, getChatHistory } from '../controllers/aiController.js';

router.post('/chat', protect, chatWithAI);
router.get('/history', protect, getChatHistory);

export default router;
