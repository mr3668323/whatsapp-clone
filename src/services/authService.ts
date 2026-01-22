/**
 * Authentication Service - REAL Firebase Phone Authentication
 * Uses Firebase Phone Auth with confirmation objects and test phone numbers.
 */

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AppState } from 'react-native';

// Global guards to prevent duplicate native calls
let activeConfirmation: FirebaseAuthTypes.ConfirmationResult | null = null;
let otpRequestInFlight = false;

/**
 * Get the active confirmation object if it exists
 * This allows screens to reuse the confirmation without requesting a new OTP
 */
export const getActiveConfirmation = (): FirebaseAuthTypes.ConfirmationResult | null => {
  return activeConfirmation;
};

/**
 * Check if Firebase Auth is properly initialized and ready
 * This performs a SAFE check that won't crash if Firebase is not ready
 */
const checkFirebaseAuthReady = (): boolean => {
  try {
    console.log('[authService] Checking Firebase Auth readiness...');
    
    // First check if we can get the auth instance
    let authInstance: any = null;
    try {
      authInstance = auth();
      if (!authInstance) {
        console.log('[authService] ❌ Firebase Auth instance is null');
        return false;
      }
      console.log('[authService] ✅ Firebase Auth instance obtained');
    } catch (error: any) {
      console.log('[authService] ❌ Failed to get Firebase Auth instance:', error?.message);
      return false;
    }
    
    // Check if we can access auth methods without crashing
    try {
      const currentUser = authInstance.currentUser;
      console.log('[authService] ✅ Firebase Auth is ready. Current user:', currentUser?.uid || 'none');
      
      // Additional check: Try to access a safe method to ensure Firebase is fully initialized
      try {
        // This is a safe check that won't trigger any network calls
        const app = authInstance.app;
        if (app) {
          console.log('[authService] ✅ Firebase App is initialized');
          return true;
        } else {
          console.log('[authService] ❌ Firebase App is null');
          return false;
        }
      } catch (appError: any) {
        console.log('[authService] ❌ Error accessing Firebase App:', appError?.message);
        return false;
      }
    } catch (error: any) {
      console.log('[authService] ❌ Error accessing Firebase Auth:', error?.message);
      return false;
    }
  } catch (error: any) {
    console.log('[authService] ❌ Firebase Auth not ready:', error?.message);
    console.log('[authService] Error stack:', error?.stack);
    return false;
  }
};

/**
 * Get Firebase configuration status for debugging
 */
export const getFirebaseStatus = (): { ready: boolean; currentUser: string | null; error?: string } => {
  try {
    const authInstance = auth();
    const currentUser = authInstance?.currentUser;
    return {
      ready: !!authInstance,
      currentUser: currentUser?.uid || null,
    };
  } catch (error: any) {
    return {
      ready: false,
      currentUser: null,
      error: error?.message || 'Unknown error',
    };
  }
};

/**
 * Reset the global OTP state (useful for testing or error recovery)
 */
export const resetOTPState = (): void => {
  console.log('[authService] Resetting OTP state');
  activeConfirmation = null;
  otpRequestInFlight = false;
};

export interface OTPVerificationResult {
  success: boolean;
  user: FirebaseAuthTypes.User | null;
  error?: string;
}

/**
 * Normalize phone number to E.164 format (+1234567890)
 * Firebase Phone Auth requires E.164 format or it will crash natively.
 * 
 * E.164 format rules:
 * - Must start with +
 * - Country code: 1-3 digits (first digit must be 1-9, not 0)
 * - Subscriber number: up to 15 total digits
 * - Example: +1234567890, +923001234567
 */
const normalizePhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    throw new Error('Phone number is required and must be a string');
  }

  // Remove all whitespace and special characters except + and digits
  let cleaned = phoneNumber.trim().replace(/[\s\-\(\)\.]/g, '');
  
  // If doesn't start with +, try to add it
  if (!cleaned.startsWith('+')) {
    // If starts with 0, remove it (common in some countries)
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.slice(1);
    }
    // Add + prefix
    cleaned = '+' + cleaned;
  }
  
  // Remove any remaining non-digit characters except the leading +
  cleaned = cleaned.charAt(0) + cleaned.slice(1).replace(/\D/g, '');
  
  // Validate E.164 format: + followed by 1-15 digits, first digit after + must be 1-9
  const e164Pattern = /^\+[1-9]\d{1,14}$/;
  if (!e164Pattern.test(cleaned)) {
    throw new Error(
      `Invalid phone number format. Expected E.164 format (e.g., +1234567890 or +923001234567). ` +
      `Got: ${phoneNumber} (normalized: ${cleaned}). ` +
      `Phone number must start with + followed by country code (1-3 digits starting with 1-9) and subscriber number.`
    );
  }
  
  return cleaned;
};

/**
 * Request OTP code for phone number via Firebase Phone Auth.
 * For test phone numbers, Firebase will use the configured test OTP (e.g. 123456).
 * 
 * CRITICAL: This function validates phone number format BEFORE calling native Firebase
 * to prevent native crashes from invalid phone numbers.
 */
export const requestOTPCode = async (
  phoneNumber: string
): Promise<FirebaseAuthTypes.ConfirmationResult> => {
  console.log('========== [authService.requestOTPCode] START ==========');
  console.log('[authService] Raw phone number:', phoneNumber);
  console.log('[authService] AppState:', AppState.currentState);

  try {
    // CRITICAL: Check if app is in foreground - Firebase Phone Auth crashes in background
    if (AppState.currentState !== 'active') {
      throw new Error('App must be in foreground to request verification code. Please try again.');
    }

    // CRITICAL: Check if Firebase Auth is ready
    if (!checkFirebaseAuthReady()) {
      throw new Error('Firebase Authentication is not ready. Please restart the app and try again.');
    }

    // CRITICAL: Normalize and validate phone number BEFORE calling native Firebase
    // Invalid phone numbers cause native crashes that bypass JS error handling
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    console.log('[authService] Normalized phone number (E.164):', normalizedPhone);

    // Check for duplicate requests
    if (otpRequestInFlight && activeConfirmation) {
      console.log('[authService] ⚠️ OTP request already in flight - reusing existing confirmation');
      return activeConfirmation;
    }

    otpRequestInFlight = true;
    
    // CRITICAL: Additional delay before calling Firebase to ensure native modules are ready
    console.log('[authService] Waiting 1 second before calling Firebase...');
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
    
    // Double-check Firebase is still ready after delay
    if (!checkFirebaseAuthReady()) {
      throw new Error('Firebase Authentication became unavailable. Please restart the app and try again.');
    }
    
    // CRITICAL: Wrap native call in try-catch with timeout to prevent hanging
    try {
      const authInstance = auth();
      console.log('[authService] Firebase Auth instance obtained');
      console.log('[authService] Current user:', authInstance.currentUser?.uid || 'none');
      
      // CRITICAL: Add timeout to prevent hanging if Firebase crashes
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('OTP request timed out after 30 seconds. Please check your internet connection and Firebase configuration.'));
        }, 30000); // 30 second timeout
      });

      console.log('[authService] ========== CALLING NATIVE FIREBASE ==========');
      console.log('[authService] Calling auth().signInWithPhoneNumber with normalized number...');
      console.log('[authService] Phone number format:', normalizedPhone);
      console.log('[authService] AppState:', AppState.currentState);
      
      // CRITICAL: Final check before native call
      if (AppState.currentState !== 'active') {
        throw new Error('App must be in foreground to request verification code.');
      }
      
      // This native call can crash if:
      // 1. Phone number format is invalid (now prevented by normalizePhoneNumber)
      // 2. Firebase Phone Auth not enabled in console
      // 3. SHA-1/SHA-256 fingerprints missing
      // 4. Test phone numbers not configured
      // 5. App is in background
      // 6. Firebase native module not initialized
      const confirmationPromise = authInstance.signInWithPhoneNumber(normalizedPhone);
      console.log('[authService] signInWithPhoneNumber promise created, waiting for result...');
      
      const confirmation = await Promise.race([confirmationPromise, timeoutPromise]);
      
      console.log('[authService] ========== NATIVE FIREBASE CALL SUCCEEDED ==========');
      
      console.log('[authService] ✅ signInWithPhoneNumber succeeded');
      console.log('[authService] Confirmation object received:', !!confirmation);
      activeConfirmation = confirmation;
      return confirmation;
    } catch (nativeError: any) {
      // Native Firebase errors can crash the app if not handled properly
      const errorCode = nativeError?.code || 'unknown';
      const errorMessage = nativeError?.message || 'Failed to request OTP';
      
      // Log error details (use console.log to avoid red screen)
      console.log('[authService] ❌ Native Firebase error:', errorCode, errorMessage);
      console.log('[authService] Error stack:', nativeError?.stack);
      
      // Provide user-friendly error messages
      let userMessage = errorMessage;
      if (errorCode === 'auth/invalid-phone-number') {
        userMessage = 'Invalid phone number format. Please check your phone number and try again.';
      } else if (errorCode === 'auth/too-many-requests') {
        userMessage = 'Too many requests. Please wait a few minutes before trying again.';
      } else if (errorCode === 'auth/quota-exceeded') {
        userMessage = 'SMS quota exceeded. Please try again later.';
      } else if (errorCode === 'auth/missing-phone-number') {
        userMessage = 'Phone number is required.';
      } else if (errorCode === 'auth/app-not-authorized') {
        userMessage = 'Firebase app not authorized. Please check Firebase Console configuration (SHA-1/SHA-256).';
      } else if (errorCode === 'auth/captcha-check-failed') {
        userMessage = 'reCAPTCHA verification failed. Please try again.';
      } else if (errorMessage.includes('timeout')) {
        userMessage = 'Request timed out. Please check your internet connection and try again.';
      } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
        userMessage = 'Network error. Please check your internet connection and try again.';
      }
      
      // Create a new error with user-friendly message (this will be caught by caller)
      const friendlyError = new Error(userMessage);
      (friendlyError as any).code = errorCode;
      throw friendlyError;
    }
  } catch (error: any) {
    // Catch validation errors and other errors (use console.log to avoid red screen)
    console.log('[authService] ❌ Error requesting OTP:', error?.code, error?.message);
    console.log('[authService] Error stack:', error?.stack);
    otpRequestInFlight = false;
    throw error;
  } finally {
    otpRequestInFlight = false;
    console.log('========== [authService.requestOTPCode] END ==========');
  }
};

/**
 * Verify OTP code using the Firebase confirmation object.
 * For test phone numbers, pass the test code configured in Firebase Console (e.g. 123456).
 * 
 * CRITICAL: This function validates the confirmation object and code BEFORE calling native Firebase
 * to prevent native crashes from invalid confirmation objects or codes.
 */
export const verifyOTP = async (
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string
): Promise<OTPVerificationResult> => {
  console.log('========== [authService.verifyOTP] START ==========');
  console.log('[authService] Code:', code);

  try {
    // Validate code format (must be 6 digits for Firebase Phone Auth)
    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      throw new Error('Invalid OTP code. Please enter a 6-digit code.');
    }

    // Use effective confirmation (passed or global)
    const effectiveConfirmation = confirmation || activeConfirmation;

    if (!effectiveConfirmation) {
      throw new Error('Missing confirmation object for OTP verification. Please request a new code.');
    }

    // CRITICAL: Wrap native call in try-catch to catch any native exceptions
    try {
      console.log('[authService] Calling confirmation.confirm(code)...');

      // This native call can crash if:
      // 1. Confirmation object is stale/invalid (now checked above)
      // 2. Code is invalid (now validated above)
      // 3. Confirmation was already used
      const userCredential = await effectiveConfirmation.confirm(code);
      console.log('[authService] ✅ confirmation.confirm resolved. Raw userCredential:', {
        providerId: userCredential?.additionalUserInfo?.providerId ?? null,
        isNewUser: userCredential?.additionalUserInfo?.isNewUser ?? null,
      });

      const user = userCredential?.user || null;

      if (!user) {
        throw new Error('Firebase returned null user after OTP verification');
      }

      console.log('[authService] ✅ OTP verified, user authenticated');
      console.log('[authService] User UID from userCredential.user.uid:', user.uid);
      console.log('[authService] User phoneNumber from userCredential.user.phoneNumber:', user.phoneNumber);

      // Immediately check Firebase Auth currentUser after confirmation
      try {
        const authInstance = auth();
        const currentUser = authInstance.currentUser;
        if (currentUser) {
          console.log('[authService] ✅ auth().currentUser is set right after confirm:', {
            uid: currentUser.uid,
            phoneNumber: currentUser.phoneNumber,
            providerData: currentUser.providerData?.map(p => p.providerId) ?? [],
          });
        } else {
          console.warn('[authService] ⚠️ auth().currentUser is NULL immediately after confirm - Firebase Auth state not finalized yet.');
        }
      } catch (stateError: any) {
        console.warn('[authService] ⚠️ Failed to read auth().currentUser after confirm (non-fatal):', stateError?.message || stateError);
      }

      console.log('========== [authService.verifyOTP] END (SUCCESS) ==========');

      // Clear active confirmation after successful verification
      activeConfirmation = null;

      return { success: true, user };
    } catch (nativeError: any) {
      // Native Firebase errors can crash the app if not handled properly
      const errorCode = nativeError?.code || 'unknown';
      const errorMessage = nativeError?.message || 'OTP verification failed';
      
      console.log('[authService] ❌ Native Firebase verification error:', errorCode, errorMessage);
      
      // Provide user-friendly error messages
      let userMessage = errorMessage;
      if (errorCode === 'auth/invalid-verification-code') {
        userMessage = 'Invalid OTP. The code you entered is incorrect.';
      } else if (errorCode === 'auth/code-expired') {
        userMessage = 'Verification code has expired. Please request a new code.';
      } else if (errorCode === 'auth/session-expired') {
        userMessage = 'Session expired. Please request a new verification code.';
      } else if (errorMessage.toLowerCase().includes('invalid') || 
                 errorMessage.toLowerCase().includes('incorrect')) {
        // Catch any other invalid code errors
        userMessage = 'Invalid OTP. The code you entered is incorrect.';
      }
      
      // Ensure error code is preserved in the return value
      activeConfirmation = null; // Clear on error
      
      const errorResult = {
        success: false,
        user: null,
        error: userMessage,
      };
      
      // Preserve error code for better error handling
      (errorResult as any).errorCode = errorCode || (errorMessage.toLowerCase().includes('invalid') ? 'auth/invalid-verification-code' : 'unknown');
      
      return errorResult;
    }
  } catch (error: any) {
    // Catch validation errors and other errors
    console.log('[authService] ❌ OTP verification failed:', error?.code, error?.message);
    console.log('========== [authService.verifyOTP] END (ERROR) ==========');
    activeConfirmation = null;
    return {
      success: false,
      user: null,
      error: error?.message || error?.code || 'OTP verification failed',
    };
  }
};

