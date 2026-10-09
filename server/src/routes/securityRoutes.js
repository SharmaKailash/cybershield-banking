import { Router } from 'express';
import { createDemoAlert, createDemoEvent, getArchitecture, getAudit, getControls, getEvents, getRisk, getThreats } from '../controllers/securityController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate);
router.get('/events', authorize('admin', 'checker'), getEvents);
router.post('/events', authorize('admin', 'checker'), asyncHandler(createDemoEvent));
router.get('/threats', getThreats);
router.get('/risk', getRisk);
router.get('/audit', authorize('admin', 'checker'), getAudit);
router.get('/controls', getControls);
router.get('/architecture', getArchitecture);
router.post('/alerts/demo', authorize('admin', 'checker'), asyncHandler(createDemoAlert));
export default router;
