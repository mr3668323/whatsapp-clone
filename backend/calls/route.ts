/**
 * Calls Routes
 * Defines call API endpoints
 */

import { Router } from 'express';
import { CallsController } from './controller';

const router = Router();

// Get call history
router.get('/', CallsController.getCallHistory);

export default router;
