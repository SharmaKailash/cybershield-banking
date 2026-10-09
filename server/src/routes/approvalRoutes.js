import { Router } from 'express';
import { decideApproval, listApprovals } from '../controllers/bankingController.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate);
router.get('/', listApprovals);
router.patch('/:id', asyncHandler(decideApproval));
export default router;
