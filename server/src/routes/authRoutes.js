import { Router } from 'express';
import { login, verifyMfa } from '../controllers/authController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authLimiter } from '../middleware/rateLimiters.js';

const router = Router();
router.post('/login', authLimiter, asyncHandler(login));
router.post('/verify-mfa', authLimiter, asyncHandler(verifyMfa));
export default router;
