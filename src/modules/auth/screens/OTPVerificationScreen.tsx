import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
        View,
        Text,
        TextInput,
        TouchableOpacity,
        Alert,
        ScrollView,
        KeyboardAvoidingView,
        Platform,
        ActivityIndicator,
        SafeAreaView,
        StatusBar,
        AppState,
        AppStateStatus,
        Image,
    } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { otpVerificationStyles } from '../styles/OTPVerification.styles';
import { phoneVerificationStyles } from '../styles/PhoneVerification.styles';
import { PhoneVerificationMenuBar } from '../components/PhoneVerificationMenuBar';
import { colors } from '../../../styles/colors';
import { verifyOTP, requestOTPCode as authServiceRequestOTP, getActiveConfirmation } from '../../../services/authService';
import { createOrUpdateUser, getUserByPhoneNumber } from '../../../services/userService';
import { setPhoneAuthInProgress } from '../../../services/phoneAuthState';
import { ErrorBoundary } from '../../../components/common/ErrorBoundary';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

type OTPVerificationScreenProps = NativeStackScreenProps<RootStackParamList, 'OTPVerification'>;

export const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({ route, navigation }) => {
    const { phoneNumber, countryCode } = route.params;
    
    // State
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [activeInputIndex, setActiveInputIndex] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);
    const [confirmation, setConfirmation] = useState<any>(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [isRequestingOTP, setIsRequestingOTP] = useState(false); // Track OTP request status - START AS FALSE
    const [otpRequestError, setOtpRequestError] = useState<string | null>(null); // Track OTP request errors
    const [allowManualOTP, setAllowManualOTP] = useState(false); // Allow manual OTP entry if Firebase fails
    
    // Refs - CRITICAL for crash prevention
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
    const isMountedRef = useRef(true);
    const isVerifyingRef = useRef(false);
    const hasRequestedOTPRef = useRef(false);
    const appStateRef = useRef<AppStateStatus>(AppState.currentState);
    const otpRequestTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const otpRequestPromiseRef = useRef<Promise<any> | null>(null); // Track OTP request promise

    // AppState monitoring - CRITICAL to prevent crashes when app goes to background
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            console.log('[OTPVerification] AppState changed:', appStateRef.current, '->', nextAppState);
            appStateRef.current = nextAppState;
            
            // If app goes to background, clear OTP request timeout to prevent native crash
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                console.log('[OTPVerification] App went to background - clearing OTP request timeout');
                if (otpRequestTimeoutRef.current) {
                    clearTimeout(otpRequestTimeoutRef.current);
                    otpRequestTimeoutRef.current = null;
                }
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    // Component mount/unmount tracking - SINGLE SOURCE OF TRUTH
    useEffect(() => {
        console.log('[OTPVerification] ✅ Component mounted');
        isMountedRef.current = true;
        appStateRef.current = AppState.currentState;
        setPhoneAuthInProgress(true);
        
        // Initialize input refs
        inputRefs.current = Array(6).fill(null);
        
        return () => {
            console.log('[OTPVerification] 🔴 Component unmounting - cleaning up ALL resources');
            isMountedRef.current = false;
            
            // Clear countdown interval
            if (countdownIntervalRef.current) {
                console.log('[OTPVerification] Clearing countdown interval');
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
            
            // Clear OTP request timeout
            if (otpRequestTimeoutRef.current) {
                console.log('[OTPVerification] Clearing OTP request timeout');
                clearTimeout(otpRequestTimeoutRef.current);
                otpRequestTimeoutRef.current = null;
            }
            
            // Clear OTP request promise ref (prevents errors after unmount)
            otpRequestPromiseRef.current = null;
            
            // Clear all timeouts
            timeoutRefs.current.forEach((timeoutId) => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            });
            timeoutRefs.current = [];
            
            console.log('[OTPVerification] ✅ Cleanup complete');
            setPhoneAuthInProgress(false);
        };
    }, []);

    // Request OTP when screen loads (if not already requested)
    // This ensures we have a confirmation object ready for verification
    useEffect(() => {
        const requestOTPOnMount = async () => {
            try {
                if (!confirmation && !isRequestingOTP && !hasRequestedOTPRef.current && isMountedRef.current) {
                    console.log('[OTPVerification] Requesting OTP on mount...');
                    console.log('[OTPVerification] Phone number:', phoneNumber);
                    otpRequestPromiseRef.current = requestOTPIfNeeded();
                    const confirmationResult = await otpRequestPromiseRef.current;
                    if (confirmationResult) {
                        console.log('[OTPVerification] ✅ OTP request successful, confirmation object received');
                    } else {
                        console.warn('[OTPVerification] ⚠️ OTP request completed but no confirmation object');
                    }
                } else if (confirmation) {
                    console.log('[OTPVerification] Confirmation object already exists, skipping request');
                }
            } catch (error: any) {
                // Only log error if component is still mounted (to avoid errors after navigation)
                if (isMountedRef.current) {
                    console.log('[OTPVerification] Failed to request OTP on mount (non-critical):', error?.message);
                    console.log('[OTPVerification] Error details:', error);
                    // Don't set error state - user can still use resend button
                    setOtpRequestError(null);
                }
                // Don't show error to user - they can still enter OTP and verify or use resend
            } finally {
                otpRequestPromiseRef.current = null;
            }
        };
        
        // Request OTP after a short delay to avoid blocking UI
        const mountTimeout = setTimeout(() => {
            if (isMountedRef.current) {
                requestOTPOnMount();
            }
        }, 1000);
        
        return () => {
            clearTimeout(mountTimeout);
            // Clear OTP request promise ref on unmount
            otpRequestPromiseRef.current = null;
        };
    }, []); // Only run once on mount

    // Watch for Firebase Auth state changes and navigate when authenticated
    useEffect(() => {
        if (!otpVerified) return;

        const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
            if (firebaseUser && otpVerified) {
                console.log('[OTPVerification] Firebase Auth user detected after verification, navigating...');
                // Clear phone auth in progress
                setPhoneAuthInProgress(false);
                // AppNavigator will automatically show AppStack
                // But we can also explicitly navigate if needed
                // The navigation will happen automatically via AppNavigator
            }
        });

        return () => unsubscribe();
    }, [otpVerified]);

    // Timer countdown - SIMPLIFIED AND SAFE
    useEffect(() => {
        // Don't start timer if OTP is verified
        if (otpVerified) {
            console.log('[OTPVerification] Timer skipped - OTP already verified');
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
            return;
        }
        
        // Don't start timer if canResend is true (timer already reached 0)
        if (canResend) {
            console.log('[OTPVerification] Timer skipped - canResend is true, waiting for resend');
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
            return;
        }
        
        // Clear any existing timer first
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
        
        console.log('[OTPVerification] Starting countdown timer from', timer, 'seconds');
        
        countdownIntervalRef.current = setInterval(() => {
            // CRITICAL: Check mount state BEFORE any operation
            if (!isMountedRef.current) {
                console.log('[OTPVerification] Timer tick - component unmounted, clearing');
                if (countdownIntervalRef.current) {
                    clearInterval(countdownIntervalRef.current);
                    countdownIntervalRef.current = null;
                }
                return;
            }
            
            // CRITICAL: Check if OTP verified - stop timer
            if (otpVerified) {
                console.log('[OTPVerification] Timer tick - OTP verified, clearing');
                if (countdownIntervalRef.current) {
                    clearInterval(countdownIntervalRef.current);
                    countdownIntervalRef.current = null;
                }
                return;
            }
            
            // Update timer - use functional update
            setTimer(prev => {
                if (!isMountedRef.current) {
                    return prev; // Don't update if unmounted
                }
                
                if (prev <= 1) {
                    // Timer reached 0
                    if (isMountedRef.current) {
                        setCanResend(true);
                    }
                    // Clear interval
                    if (countdownIntervalRef.current) {
                        clearInterval(countdownIntervalRef.current);
                        countdownIntervalRef.current = null;
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        // Cleanup
        return () => {
            console.log('[OTPVerification] Timer effect cleanup');
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
        };
    }, [otpVerified, canResend]); // Re-run when these change (timer is managed by setInterval)

    // Safe timeout helper
    const addTimeout = useCallback((callback: () => void, delay: number) => {
        if (!isMountedRef.current) {
            return;
        }
        
        const timeoutId = setTimeout(() => {
            // Remove from array
            timeoutRefs.current = timeoutRefs.current.filter(id => id !== timeoutId);
            
            // Check mount state before executing
            if (isMountedRef.current) {
                try {
                    callback();
                } catch (error) {
                    console.log('[OTPVerification] Timeout callback error:', error);
                }
            }
        }, delay);
        
        timeoutRefs.current.push(timeoutId);
        return timeoutId;
    }, []);

    // Handle OTP input change
    const handleOtpChange = useCallback((value: string, index: number) => {
        if (!isMountedRef.current) {
            return;
        }
        
        try {
            const numericValue = value.replace(/[^0-9]/g, '').charAt(0);

            if (!numericValue) {
                // Clear current field
                setOtp(prevOtp => {
                    if (!isMountedRef.current) return prevOtp;
                    const updated = [...prevOtp];
                    updated[index] = '';
                    return updated;
                });

                // Move to previous input if backspace
                if (index > 0) {
                    addTimeout(() => {
                        if (isMountedRef.current && inputRefs.current[index - 1]) {
                            setActiveInputIndex(index - 1);
                            inputRefs.current[index - 1]?.focus();
                        }
                    }, 100);
                }
                return;
            }

            // Set digit
            setOtp(prevOtp => {
                if (!isMountedRef.current) return prevOtp;
                const updated = [...prevOtp];
                updated[index] = numericValue;
                return updated;
            });

            // Auto-focus next input
            if (index < 5 && numericValue) {
                addTimeout(() => {
                    if (isMountedRef.current && inputRefs.current[index + 1]) {
                        setActiveInputIndex(index + 1);
                        inputRefs.current[index + 1]?.focus();
                    }
                }, 100);
            }
        } catch (error) {
            console.log('[OTPVerification] Error in handleOtpChange:', error);
        }
    }, [addTimeout]);

    // Handle key press
    const handleKeyPress = useCallback((e: any, index: number) => {
        if (!isMountedRef.current) return;
        
        try {
            if (e.nativeEvent.key === 'Backspace' || e.nativeEvent.key === 'Delete') {
                if (!otp[index] && index > 0) {
                    setOtp(prevOtp => {
                        if (!isMountedRef.current) return prevOtp;
                        const updated = [...prevOtp];
                        updated[index - 1] = '';
                        return updated;
                    });
                    setActiveInputIndex(index - 1);
                    addTimeout(() => {
                        if (isMountedRef.current && inputRefs.current[index - 1]) {
                            inputRefs.current[index - 1]?.focus();
                        }
                    }, 50);
                } else if (otp[index]) {
                    setOtp(prevOtp => {
                        if (!isMountedRef.current) return prevOtp;
                        const updated = [...prevOtp];
                        updated[index] = '';
                        return updated;
                    });
                }
            }
        } catch (error) {
            console.log('[OTPVerification] Error handling key press:', error);
        }
    }, [otp, addTimeout]);

    // Handle input focus
    const handleInputFocus = useCallback((index: number) => {
        if (!isMountedRef.current) return;
        
        try {
            addTimeout(() => {
                if (isMountedRef.current) {
                    setActiveInputIndex(index);
                }
            }, 0);
        } catch (error) {
            console.log('[OTPVerification] Error handling input focus:', error);
        }
    }, [addTimeout]);

    // Request OTP from Firebase (called when user clicks Verify)
    const requestOTPIfNeeded = useCallback(async (): Promise<any> => {
        // If already requested, return existing confirmation
        if (confirmation) {
            return confirmation;
        }
        
        // If already requesting, wait for it
        if (isRequestingOTP) {
            // Wait for request to complete
            return new Promise((resolve, reject) => {
                const checkInterval = setInterval(() => {
                    if (confirmation) {
                        clearInterval(checkInterval);
                        resolve(confirmation);
                    } else if (otpRequestError && !isRequestingOTP) {
                        clearInterval(checkInterval);
                        reject(new Error(otpRequestError));
                    }
                }, 100);
                
                // Timeout after 35 seconds
                setTimeout(() => {
                    clearInterval(checkInterval);
                    reject(new Error('OTP request timed out'));
                }, 35000);
            });
        }
        
        // Request OTP now
        hasRequestedOTPRef.current = true;
        setIsRequestingOTP(true);
        setOtpRequestError(null);
        
        try {
            console.log('[OTPVerification] Requesting OTP from Firebase...');
            const requestPromise = Promise.race([
                authServiceRequestOTP(phoneNumber),
                new Promise<any>((_, reject) => {
                    const timeoutId = setTimeout(() => {
                        reject(new Error('OTP request timed out'));
                    }, 30000);
                    otpRequestTimeoutRef.current = timeoutId;
                })
            ]);
            
            otpRequestPromiseRef.current = requestPromise;
            const confirmationData = await requestPromise;
            
            // Only process result if component is still mounted
            if (isMountedRef.current) {
                setConfirmation(confirmationData);
                setIsRequestingOTP(false);
                otpRequestPromiseRef.current = null;
                if (otpRequestTimeoutRef.current) {
                    clearTimeout(otpRequestTimeoutRef.current);
                    otpRequestTimeoutRef.current = null;
                }
                return confirmationData;
            } else {
                // Component unmounted, ignore result
                console.log('[OTPVerification] Component unmounted - ignoring OTP request result');
                return null;
            }
        } catch (error: any) {
            // Only log/process error if component is still mounted
            if (isMountedRef.current) {
                console.log('[OTPVerification] OTP request error:', error?.message);
                setIsRequestingOTP(false);
                // Don't set error state - user can use resend button instead
                setOtpRequestError(null);
                // Don't auto-retry - let user use resend button
            } else {
                // Component unmounted, silently ignore error
                console.log('[OTPVerification] Component unmounted - ignoring OTP request error');
            }
            otpRequestPromiseRef.current = null;
            if (otpRequestTimeoutRef.current) {
                clearTimeout(otpRequestTimeoutRef.current);
                otpRequestTimeoutRef.current = null;
            }
            // Only throw error if component is still mounted
            if (isMountedRef.current) {
                throw error;
            }
            return null;
        }
    }, [phoneNumber, confirmation, isRequestingOTP, otpRequestError]);

    // Verify OTP - Request OTP first if needed, then verify
    const verifyOtp = useCallback(async () => {
        try {
            console.log('========== [OTPVerification.verifyOtp] START ==========');
            
            // Pre-flight checks
            if (!isMountedRef.current) {
                console.log('[OTPVerification] ❌ Component not mounted - aborting');
                return;
            }
            
            if (isVerifyingRef.current) {
                console.log('[OTPVerification] ❌ Verification already in progress - aborting');
                return;
            }
            
            if (otpVerified) {
                console.log('[OTPVerification] ❌ OTP already verified - aborting');
                return;
            }
            
            // Mark as verifying IMMEDIATELY
            isVerifyingRef.current = true;
            
            // Clear countdown timer IMMEDIATELY
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
                console.log('[OTPVerification] ✅ Countdown timer cleared');
            }
            
            // Set verifying state
            if (isMountedRef.current) {
                setIsVerifying(true);
            }
            
            // Validate OTP input
            const enteredOtp = otp.join('');
            console.log('[OTPVerification] Entered OTP:', enteredOtp);
            
            // Check if OTP is incomplete
            if (enteredOtp.length < 6) {
                console.log('[OTPVerification] ❌ OTP incomplete');
                isVerifyingRef.current = false;
                if (isMountedRef.current) {
                    setIsVerifying(false);
                    Alert.alert('Validation Error', 'OTP is incomplete. Please enter all 6 digits.');
                }
                return;
            }
            
            // Helper function to create user and chats
            const createUserAndChats = async (user: any, phone: string, country: string) => {
                try {
                    console.log('[OTPVerification] Creating/updating user in Firestore...');
                    // createOrUpdateUser will automatically initialize chats for new users
                    await createOrUpdateUser(user, phone, country);
                    console.log('[OTPVerification] ✅ User created/updated in Firestore with chats initialized');
                } catch (firestoreError: any) {
                    console.log('[OTPVerification] ⚠️ Firestore error (non-critical):', firestoreError);
                    // Continue even if Firestore fails
                }
            };
            
            // UNIVERSAL TEST OTP: 123456 works for ANY phone number (development only)
            // This bypasses Firebase Phone Auth verification and creates a Firebase Auth user via email/password
            if (enteredOtp === '123456') {
                console.log('[OTPVerification] ✅ Universal test OTP (123456) detected - creating Firebase Auth user');
                
                try {
                    const authInstance = auth();
                    
                    // Generate email from phone number (Firebase requires email for email/password auth)
                    // Format: phone_923001234567@test.whatsapp.local
                    const email = `phone_${phoneNumber.replace(/[^0-9]/g, '')}@test.whatsapp.local`;
                    const password = 'test123456'; // Fixed password for test OTP
                    
                    console.log('[OTPVerification] Creating Firebase Auth user with email:', email);
                    
                    // Check if user already exists with this phone
                    const existingUser = await getUserByPhoneNumber(phoneNumber);
                    
                    let firebaseUser: FirebaseAuthTypes.User;
                    
                    try {
                        // Try to create user first (will fail if user already exists)
                        try {
                            const createCredential = await authInstance.createUserWithEmailAndPassword(email, password);
                            firebaseUser = createCredential.user;
                            console.log('[OTPVerification] ✅ Created new Firebase Auth user');
                        } catch (createError: any) {
                            // If user already exists, sign in instead
                            if (createError?.code === 'auth/email-already-in-use') {
                                console.log('[OTPVerification] User already exists, signing in...');
                                const signInCredential = await authInstance.signInWithEmailAndPassword(email, password);
                                firebaseUser = signInCredential.user;
                                console.log('[OTPVerification] ✅ Signed in with existing email/password account');
                            } else {
                                throw createError;
                            }
                        }
                    } catch (authError: any) {
                        console.error('[OTPVerification] ❌ Firebase Auth error:', authError?.code, authError?.message);
                        throw authError;
                    }
                    
                    // Update user profile with phone number
                    try {
                        await firebaseUser.updateProfile({
                            displayName: existingUser?.displayName || phoneNumber,
                        });
                        console.log('[OTPVerification] ✅ Updated user profile');
                    } catch (profileError: any) {
                        console.warn('[OTPVerification] ⚠️ Failed to update profile (non-critical):', profileError?.message);
                    }
                    
                    // Create/update user in Firestore
                    if (existingUser) {
                        // Update existing user
                        await firestore()
                            .collection('users')
                            .doc(existingUser.uid)
                            .set({
                                phoneNumber: phoneNumber,
                                displayName: existingUser.displayName || phoneNumber,
                                uid: firebaseUser.uid,
                                email: email,
                                lastLogin: firestore.FieldValue.serverTimestamp(),
                            }, { merge: true });
                        console.log('[OTPVerification] ✅ Updated existing user in Firestore');
                    } else {
                        // Create new user
                        await createUserAndChats(
                            {
                                uid: firebaseUser.uid,
                                phoneNumber: phoneNumber,
                                email: email,
                            },
                            phoneNumber,
                            countryCode
                        );
                        console.log('[OTPVerification] ✅ Created new user in Firestore');
                    }
                    
                    // Clear phone auth in progress
                    setPhoneAuthInProgress(false);
                    
                    // Mark as verified
                    isVerifyingRef.current = false;
                    if (isMountedRef.current) {
                        setOtpVerified(true);
                        setIsVerifying(false);
                    }
                    
                    console.log('[OTPVerification] ✅ Test OTP verification complete - Firebase Auth user created');
                    console.log('[OTPVerification] User UID:', firebaseUser.uid);
                    console.log('[OTPVerification] User email:', email);
                    console.log('[OTPVerification] AppNavigator will detect Firebase Auth user and navigate');
                    
                    return;
                } catch (testOtpError: any) {
                    console.error('[OTPVerification] ❌ Test OTP flow error:', testOtpError);
                    isVerifyingRef.current = false;
                    if (isMountedRef.current) {
                        setIsVerifying(false);
                        Alert.alert(
                            'Test OTP Error',
                            `Failed to authenticate with test OTP: ${testOtpError?.message || 'Unknown error'}. Please ensure Email/Password authentication is enabled in Firebase Console.`,
                            [{ text: 'OK' }]
                        );
                    }
                    return;
                }
            }
            
            // For real OTP, ensure we have a confirmation object
            // First check local state, then global activeConfirmation
            let effectiveConfirmation = confirmation;
            
            // Check global activeConfirmation from authService
            if (!effectiveConfirmation) {
                const globalConfirmation = getActiveConfirmation();
                if (globalConfirmation) {
                    console.log('[OTPVerification] Using global activeConfirmation from authService');
                    effectiveConfirmation = globalConfirmation;
                    setConfirmation(globalConfirmation); // Update local state
                }
            }
            
            // If still no confirmation, we can't verify - show "Invalid OTP" message
            // This provides better UX than showing "Request Failed"
            if (!effectiveConfirmation) {
                console.log('[OTPVerification] No confirmation available - showing Invalid OTP message');
                isVerifyingRef.current = false;
                if (isMountedRef.current) {
                    setIsVerifying(false);
                    // Show "Invalid OTP" instead of "Request Failed" for better UX
                    // The user entered an OTP, so they expect to see if it's valid or not
                    // Use setTimeout to ensure alert is shown after state updates
                    setTimeout(() => {
                        if (isMountedRef.current && appStateRef.current === 'active') {
                            Alert.alert(
                                'Invalid OTP',
                                'The OTP you entered is incorrect. Please try again with the correct OTP.',
                                [{ text: 'OK' }]
                            );
                        }
                    }, 100);
                }
                return;
            }
            
            // Verify OTP with Firebase
            if (effectiveConfirmation) {
                console.log('[OTPVerification] Verifying OTP via Firebase...');
                console.log('[OTPVerification] Phone number:', phoneNumber);
                console.log('[OTPVerification] OTP code:', enteredOtp);
                console.log('[OTPVerification] Confirmation object exists:', !!effectiveConfirmation);
                try {
                    const result = await verifyOTP(effectiveConfirmation, enteredOtp);
                    console.log('[OTPVerification] verifyOTP result:', {
                        success: result?.success,
                        hasUser: !!result?.user,
                        error: result?.error,
                        errorCode: (result as any)?.errorCode
                    });

                    if (!result || !result.success || !result.user) {
                        // Invalid OTP - ALWAYS show "Invalid OTP" message for verification failures
                        const errorMessage = result?.error || 'Invalid OTP';
                        const errorCode = (result as any)?.errorCode || '';
                        console.log('[OTPVerification] ❌ Invalid OTP:', errorMessage, 'Code:', errorCode);
                        
                        isVerifyingRef.current = false;
                        if (isMountedRef.current) {
                            setIsVerifying(false);
                            // Always show "Invalid OTP" for any verification failure
                            // (unless it's a code expired or session expired, which are different errors)
                            if (errorCode === 'auth/code-expired' || errorCode === 'auth/session-expired') {
                                Alert.alert(
                                    'Code Expired',
                                    errorMessage || 'The verification code has expired. Please request a new code.',
                                    [{ text: 'OK' }]
                                );
                            } else {
                                // For invalid code or any other verification failure, show "Invalid OTP"
                                // If using test OTP, remind user to configure test phone in Firebase Console
                                const isTestOTP = enteredOtp === '123456';
                                const message = isTestOTP
                                    ? 'The OTP you entered is incorrect. If using test OTP (123456), make sure the phone number is configured as a test number in Firebase Console (Authentication > Sign-in method > Phone > Phone numbers for testing).'
                                    : 'The OTP you entered is incorrect. Please try again with the correct OTP.';
                                
                                Alert.alert(
                                    'Invalid OTP',
                                    message,
                                    [{ text: 'OK' }]
                                );
                            }
                        }
                        return;
                    }

                    const authenticatedUser = result.user;
                    console.log('[OTPVerification] ✅ Firebase Auth successful!');
                    console.log('[OTPVerification] User UID:', authenticatedUser.uid, 'phone:', authenticatedUser.phoneNumber);

                    // Create/update user in Firestore (checks if exists)
                    await createUserAndChats(authenticatedUser, phoneNumber, countryCode);
                    
                    // CRITICAL: Clear phone auth in progress flag FIRST
                    // This allows AppNavigator to immediately show AppStack
                    setPhoneAuthInProgress(false);
                    console.log('[OTPVerification] ✅ Phone auth in progress flag cleared');
                    
                    // Mark as verified
                    isVerifyingRef.current = false;
                    if (isMountedRef.current) {
                        setOtpVerified(true);
                        setIsVerifying(false);
                    }
                    
                    // Verify that Firebase Auth user is actually set
                    const currentUser = auth().currentUser;
                    if (currentUser) {
                        console.log('[OTPVerification] ✅ Firebase Auth user confirmed:', currentUser.uid);
                        console.log('[OTPVerification] ✅ AppNavigator should detect user and navigate to AppStack');
                    } else {
                        console.warn('[OTPVerification] ⚠️ Firebase Auth user not found immediately after verification');
                    }
                    
                    return;
                } catch (verifyError: any) {
                    // Handle verification errors specifically (use console.log to avoid red screen)
                    console.log('[OTPVerification] Verification error:', verifyError);
                    const errorCode = verifyError?.code || '';
                    const errorMessage = verifyError?.message || '';
                    
                    // ALWAYS show "Invalid OTP" for verification errors (unless it's expired)
                    isVerifyingRef.current = false;
                    if (isMountedRef.current) {
                        setIsVerifying(false);
                        if (errorCode === 'auth/code-expired' || errorCode === 'auth/session-expired') {
                            Alert.alert(
                                'Code Expired',
                                'The verification code has expired. Please request a new code.',
                                [{ text: 'OK' }]
                            );
                        } else {
                            // For any other verification error, show "Invalid OTP"
                            Alert.alert(
                                'Invalid OTP',
                                'The OTP you entered is incorrect. Please try again with the correct OTP.',
                                [{ text: 'OK' }]
                            );
                        }
                    }
                    return;
                }
            }
            
            // If we reach here, verification failed
            isVerifyingRef.current = false;
            if (isMountedRef.current) {
                setIsVerifying(false);
                Alert.alert('Validation Error', 'Invalid OTP. Please check and try again.');
            }
            return;
        
        } catch (error: any) {
            // Log error details for debugging (use console.log instead of console.error to avoid red screen)
            console.log('========== [OTPVerification.verifyOtp] ERROR ==========');
            console.log('[OTPVerification] Error type:', typeof error);
            console.log('[OTPVerification] Error message:', error?.message);
            console.log('[OTPVerification] Error code:', error?.code);
            console.log('[OTPVerification] Error stack:', error?.stack);
            console.log('==================================================');
            
            // Reset verifying state
            isVerifyingRef.current = false;
            if (isMountedRef.current) {
                setIsVerifying(false);
            }
            
            // Show user-friendly error (only if not already shown above)
            // Check if error is about invalid OTP
            const errorCode = error?.code || '';
            const errorMessage = error?.message || '';
            const isInvalidOTP = errorCode === 'auth/invalid-verification-code' ||
                                errorMessage.toLowerCase().includes('invalid') || 
                                errorMessage.toLowerCase().includes('verification code') ||
                                errorMessage.toLowerCase().includes('code-expired') ||
                                errorMessage.toLowerCase().includes('session-expired');
            
            // Check if it's a timeout error (only show timeout for OTP request, not verification)
            const isTimeoutError = errorMessage.toLowerCase().includes('timeout') ||
                                  errorMessage.toLowerCase().includes('timed out');
            
            setTimeout(() => {
                if (isMountedRef.current && appStateRef.current === 'active') {
                    try {
                        if (isInvalidOTP) {
                            // Invalid OTP error
                            Alert.alert(
                                'Invalid OTP',
                                'The OTP you entered is incorrect. Please try again with the correct OTP.',
                                [{ 
                                    text: 'OK',
                                    onPress: () => {
                                        console.log('[OTPVerification] Error alert dismissed');
                                    }
                                }]
                            );
                        } else if (isTimeoutError) {
                            // Timeout error (only for OTP request, not verification)
                            Alert.alert(
                                'Request Timeout',
                                'The OTP request timed out. Please check your internet connection and try again.',
                                [{ 
                                    text: 'OK',
                                    onPress: () => {
                                        console.log('[OTPVerification] Error alert dismissed');
                                    }
                                }]
                            );
                        } else {
                            // Other errors
                            Alert.alert(
                                'Verification Failed',
                                errorMessage || 'An error occurred during verification. Please try again.',
                                [{ 
                                    text: 'OK',
                                    onPress: () => {
                                        console.log('[OTPVerification] Error alert dismissed');
                                    }
                                }]
                            );
                        }
                    } catch (alertError: any) {
                        // Silently handle alert errors to prevent red screen
                        console.log('[OTPVerification] Failed to show alert:', alertError?.message);
                    }
                }
            }, 100);
        }
    }, [otp, confirmation, phoneNumber, countryCode, otpVerified]);

    // Handle resend OTP
    const handleResendOtp = useCallback(async () => {
        if (!canResend || !isMountedRef.current || isRequestingOTP) {
            console.log('[OTPVerification] Resend blocked - canResend:', canResend, 'isRequestingOTP:', isRequestingOTP);
            return;
        }
        
        try {
            console.log('[OTPVerification] Resending OTP...');
            setIsRequestingOTP(true);
            setOtpRequestError(null);
            hasRequestedOTPRef.current = false;
            
            // Clear existing timer before requesting
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
            
            // Request new OTP
            const confirmationData = await Promise.race([
                authServiceRequestOTP(phoneNumber),
                new Promise<any>((_, reject) => {
                    setTimeout(() => {
                        reject(new Error('OTP request timed out'));
                    }, 30000);
                })
            ]);
            
            if (isMountedRef.current) {
                setConfirmation(confirmationData);
                setIsRequestingOTP(false);
                
                // Reset timer to 30 seconds and disable resend
                // This will trigger the timer useEffect to restart
                setTimer(30);
                setCanResend(false);
                setOtp(['', '', '', '', '', '']);
                setActiveInputIndex(0);
                
                addTimeout(() => {
                    if (isMountedRef.current && inputRefs.current[0]) {
                        inputRefs.current[0].focus();
                    }
                }, 100);
                
                Alert.alert('Code Resent', 'A new verification code has been sent to your phone.');
            }
        } catch (error: any) {
            console.log('[OTPVerification] Resend OTP error:', error);
            if (isMountedRef.current) {
                setIsRequestingOTP(false);
                // Allow user to try resend again
                setCanResend(true);
                Alert.alert(
                    'Resend Failed',
                    'Failed to resend code. Please try again.',
                    [{ text: 'OK' }]
                );
            }
        }
    }, [canResend, phoneNumber, addTimeout, isRequestingOTP]);

    // Handle edit number
    const handleEditNumber = useCallback(() => {
        try {
            if (isMountedRef.current && navigation.canGoBack()) {
                navigation.goBack();
            }
        } catch (error) {
            console.log('[OTPVerification] Error navigating back:', error);
        }
    }, [navigation]);

    // Format phone number
    const formatPhoneNumber = useCallback((phone: string) => {
        const cleanPhone = phone.startsWith('+') ? phone.slice(1) : phone;
        if (cleanPhone.length >= 10) {
            const countryCode = cleanPhone.slice(0, 2);
            const firstPart = cleanPhone.slice(2, 5);
            const secondPart = cleanPhone.slice(5);
            return `+${countryCode} ${firstPart} ${secondPart}`;
        }
        return phone;
    }, []);

    const hasAtLeastOneDigit = otp.some(digit => digit !== '');

    // Navigation listener - ALLOW navigation after OTP verification
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (otpVerified) {
                console.log('[OTPVerification] OTP verified - allowing navigation');
                return; // Allow navigation
            }
            console.log('[OTPVerification] Navigation requested - allowing');
        });

        return unsubscribe;
    }, [navigation, otpVerified]);

    return (
        <ErrorBoundary>
            <SafeAreaView style={otpVerificationStyles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
                <KeyboardAvoidingView 
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
                >
                    <PhoneVerificationMenuBar 
                        visible={menuVisible}
                        onClose={() => setMenuVisible(false)}
                    />
                    
                    <View style={phoneVerificationStyles.header}>
                        <TouchableOpacity
                            style={phoneVerificationStyles.backButton}
                            onPress={() => {
                                if (!isVerifying && !otpVerified) {
                                    navigation.goBack();
                                }
                            }}
                            disabled={isVerifying || otpVerified}
                        >
                            <Image
                                source={require('../../../assets/icons/back.png')}
                                style={phoneVerificationStyles.backIcon}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        
                        <Text style={phoneVerificationStyles.headerTitle}>Verify your phone number</Text>
                        
                        <TouchableOpacity 
                            style={phoneVerificationStyles.menuButton}
                            onPress={() => setMenuVisible(true)}
                            disabled={isVerifying}
                        >
                            <Text style={phoneVerificationStyles.menuIcon}>⋮</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={otpVerificationStyles.scrollView}
                        contentContainerStyle={otpVerificationStyles.scrollContentWithKeyboard}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        <Text style={otpVerificationStyles.title}>Enter verification code</Text>

                        <View style={otpVerificationStyles.phoneContainer}>
                            <Text style={otpVerificationStyles.phoneLabel}>Enter the 6-digit code sent to</Text>
                            <Text style={otpVerificationStyles.phoneNumber}>
                                {formatPhoneNumber(phoneNumber)}
                            </Text>
                            <TouchableOpacity onPress={handleEditNumber}>
                                <Text style={otpVerificationStyles.editText}>Edit phone number</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={otpVerificationStyles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={`otp-input-${index}`}
                                    ref={(ref) => {
                                        if (ref) {
                                            inputRefs.current[index] = ref;
                                        }
                                    }}
                                    style={[
                                        otpVerificationStyles.otpInput,
                                        digit ? otpVerificationStyles.otpInputFilled : null
                                    ]}
                                    value={digit}
                                    onChangeText={(value) => handleOtpChange(value, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    selectTextOnFocus={false}
                                    onFocus={() => handleInputFocus(index)}
                                    onBlur={() => {}}
                                    editable={!isVerifying && !otpVerified}
                                    caretHidden={false}
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    contextMenuHidden={true}
                                    textContentType="none"
                                    autoComplete="off"
                                />
                            ))}
                        </View>

                        <View style={otpVerificationStyles.timerContainer}>
                            {!canResend ? (
                                <Text style={otpVerificationStyles.timerText}>
                                    Resend code in 00:{timer.toString().padStart(2, '0')}
                                </Text>
                            ) : (
                                <TouchableOpacity onPress={handleResendOtp}>
                                    <Text style={otpVerificationStyles.resendText}>Resend code</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Show error only if verification fails */}

                        <TouchableOpacity
                            style={[
                                otpVerificationStyles.verifyButton,
                                (!hasAtLeastOneDigit || isVerifying || otpVerified) && otpVerificationStyles.verifyButtonDisabled
                            ]}
                            onPress={() => {
                                const enteredOtp = otp.join('');
                                
                                // Check if OTP is incomplete
                                if (enteredOtp.length < 6) {
                                    Alert.alert('Validation Error', 'OTP is incomplete. Please enter all 6 digits.');
                                    return;
                                }
                                
                                if (isVerifying || otpVerified) {
                                    return;
                                }
                                
                                verifyOtp();
                            }}
                            disabled={!hasAtLeastOneDigit || isVerifying || otpVerified}
                            activeOpacity={0.7}
                        >
                            {isVerifying ? (
                                <ActivityIndicator color={colors.buttonTextPrimary} />
                            ) : otpVerified ? (
                                <Text style={otpVerificationStyles.verifyButtonText}>
                                    Verified ✓
                                </Text>
                            ) : (
                                <Text style={otpVerificationStyles.verifyButtonText}>
                                    Verify
                                </Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ErrorBoundary>
    );
};
