import { Router } from 'express';
import { addBeneficiary, listAccounts, listBeneficiaries, listTransactions, submitTransfer } from '../controllers/bankingController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate);
router.get('/accounts', listAccounts);
router.get('/beneficiaries', listBeneficiaries);
router.post('/beneficiaries', authorize('customer'), asyncHandler(addBeneficiary));
router.get('/transactions', listTransactions);
router.post('/transactions', authorize('customer'), asyncHandler(submitTransfer));
export default router;
