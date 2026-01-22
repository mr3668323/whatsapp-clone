/**
 * Updates Routes
 * Defines status/channel API endpoints
 */

import { Router } from 'express';
import { UpdatesController } from './controller';

const router = Router();

// Get status updates
router.get('/status', UpdatesController.getStatusUpdates);

// Get channels
router.get('/channels', UpdatesController.getChannels);

export default router;
