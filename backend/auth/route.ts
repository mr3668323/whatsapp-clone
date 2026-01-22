/**
 * Auth Routes
 * Defines authentication API endpoints
 */

import { Router } from 'express';
import { AuthController } from './controller';

const router = Router();

// Register new user
router.post('/register', AuthController.register);

// Verify OTP
router.post('/verify-otp', AuthController.verifyOTP);

// Resend OTP
router.post('/resend-otp', AuthController.resendOTP);

export default router;
