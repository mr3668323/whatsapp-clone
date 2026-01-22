/**
 * Root App Entry Point
 * Wraps the 
 * app with required providers and renders AppNavigator
 */

import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { colors } from './src/styles/colors';

// Global error handler to prevent app crashes
try {
  const RN = require('react-native');
  const ErrorUtils = RN.ErrorUtils;
  
  if (ErrorUtils) {
    const originalErrorHandler = ErrorUtils.getGlobalHandler();

    ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      // Suppress Firestore unavailable errors - they're expected on emulator
      if (error?.message?.includes('firestore/unavailable') || 
          error?.message?.includes('Firestore unavailable') ||
          error?.message?.includes('service is currently unavailable')) {
        // Silently ignore - this is expected when Firestore is not available
        console.log('Firestore unavailable (suppressed - this is OK)');
        return; // Don't show error to user
      }
      
      // Handle other Firebase/auth errors gracefully - don't crash
      // CRITICAL: Catch phone auth errors specifically to prevent native crashes
      const errorCode = (error as any)?.code;
      if (error?.message?.includes('Firebase') || 
          error?.message?.includes('auth') ||
          error?.message?.includes('Firestore') ||
          error?.message?.includes('DeviceInfo') ||
          error?.message?.includes('signInWithPhoneNumber') ||
          error?.message?.includes('linkWithCredential') ||
          error?.message?.includes('PhoneAuthProvider') ||
          error?.message?.includes('credential') ||
          error?.message?.includes('deprecated') ||
          error?.message?.includes('onAuthStateChanged') ||
          error?.message?.includes('signInAnonymously') ||
          error?.message?.includes('invalid-phone-number') ||
          error?.message?.includes('invalid-verification-code') ||
          error?.message?.includes('code-expired') ||
          error?.message?.includes('session-expired') ||
          error?.message?.includes('too-many-requests') ||
          error?.message?.includes('quota-exceeded') ||
          (errorCode && String(errorCode).includes('auth/'))) {
        console.warn('Firebase/Auth/PhoneAuth Error (non-fatal):', errorCode || error?.message || error);
        // Don't crash - just log it as non-fatal
        if (originalErrorHandler) {
          originalErrorHandler(error, false);
        }
        return;
      }
      
      // For other errors, use original handler
      if (originalErrorHandler) {
        originalErrorHandler(error, isFatal);
      }
    });
  }
} catch (e) {
  console.warn('Could not set up error handler:', e);
}

// Handle unhandled promise rejections
try {
  // @ts-ignore - global is available in React Native runtime
  // eslint-disable-next-line no-undef
  const globalObj = (typeof globalThis !== 'undefined' ? globalThis : (typeof global !== 'undefined' ? (global as any) : {})) as any;
  const originalPromiseRejectionHandler = globalObj.onunhandledrejection;
  
    globalObj.onunhandledrejection = (event: any) => {
      const reason = event?.reason;
      const errorMessage = reason?.message || '';
      
      // Suppress Firestore unavailable errors - they're expected on emulator
      if (errorMessage.includes('firestore/unavailable') || 
          errorMessage.includes('Firestore unavailable') ||
          errorMessage.includes('service is currently unavailable')) {
        // Silently ignore - this is expected when Firestore is not available
        console.log('Firestore unavailable promise rejection (suppressed - this is OK)');
        if (event.preventDefault) {
          event.preventDefault(); // Prevent showing error
        }
        return; // Don't show error to user
      }
      
      // Don't crash on Firebase/auth promise rejections
      // CRITICAL: Catch phone auth promise rejections specifically to prevent native crashes
      if (errorMessage.includes('Firebase') || 
          errorMessage.includes('auth') ||
          errorMessage.includes('Firestore') ||
          errorMessage.includes('timeout') ||
          errorMessage.includes('DeviceInfo') ||
          errorMessage.includes('signInWithPhoneNumber') ||
          errorMessage.includes('linkWithCredential') ||
          errorMessage.includes('PhoneAuthProvider') ||
          errorMessage.includes('credential') ||
          errorMessage.includes('deprecated') ||
          errorMessage.includes('onAuthStateChanged') ||
          errorMessage.includes('signInAnonymously') ||
          errorMessage.includes('invalid-phone-number') ||
          errorMessage.includes('invalid-verification-code') ||
          errorMessage.includes('code-expired') ||
          errorMessage.includes('session-expired') ||
          errorMessage.includes('too-many-requests') ||
          errorMessage.includes('quota-exceeded') ||
          errorMessage.includes('network') ||
          errorMessage.includes('connection') ||
          errorMessage.includes('ECONNREFUSED') ||
          errorMessage.includes('ENOTFOUND') ||
          (reason && typeof reason === 'object' && (reason as any).code && String((reason as any).code).includes('auth/'))) {
        console.warn('Caught Firebase/PhoneAuth Promise Error (non-fatal):', errorMessage || reason);
        if (event.preventDefault) {
          event.preventDefault(); // Prevent crash
        }
        return;
      }
      
      // For other rejections, use original handler
      if (originalPromiseRejectionHandler) {
        originalPromiseRejectionHandler(event);
      }
    };
} catch (e) {
  console.warn('Could not set up promise rejection handler:', e);
}

import { ErrorBoundary } from './src/components/common/ErrorBoundary';

function App(): React.JSX.Element {
  // Native splash screen is shown by MainActivity.onCreate() and onResume()
  // It will be hidden by AppNavigator after auth state is resolved

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
          <AuthProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </AuthProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

export default App;
