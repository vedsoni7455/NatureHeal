import express from 'express';
import { submitContactForm } from '../controllers/contactController.js';
import { contactRules, validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/', contactRules, validate, submitContactForm);

export default router;
