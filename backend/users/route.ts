/**
 * Users Routes
 * Defines user API endpoints
 */

import { Router } from 'express';
import { UsersController } from './controller';

const router = Router();

// Get user profile
router.get('/:userId', UsersController.getUserProfile);

// Update user profile
router.put('/:userId', UsersController.updateUserProfile);

export default router;
