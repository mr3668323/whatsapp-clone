import React, { createContext, useContext, useState, useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  // Firebase Auth user - null if not authenticated
  user: FirebaseAuthTypes.User | null;
  // Manual auth flag (for test OTP fallback)
  manualAuth: boolean;
  // Loading state during auth check
  loading: boolean;
  // Initializing state (first auth check)
  initializing: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  manualAuth: false,
  loading: true,
  initializing: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider - Manages Firebase Authentication state
 * 
 * This provider:
 * - Listens to Firebase Auth state changes via onAuthStateChanged
 * - Tracks manual auth state (for test OTP fallback)
 * - Provides authenticated user to all child components
 * - Handles loading and initializing states
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [manualAuth, setManualAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    console.log('[AuthContext] Setting up Firebase auth state listener...');

    // Check for manual auth (test OTP fallback)
    const checkManualAuth = async () => {
      try {
        const isManual = await AsyncStorage.getItem('isManualAuth');
        if (isManual === 'true') {
          console.log('[AuthContext] Manual auth detected');
          setManualAuth(true);
        } else {
          setManualAuth(false);
        }
      } catch (e) {
        console.log('[AuthContext] Failed to read manual auth state:', e);
        setManualAuth(false);
      }
    };

    // Initial manual auth check
    checkManualAuth();

    // Set up interval to check manual auth changes
    const manualAuthInterval = setInterval(() => {
      checkManualAuth();
    }, 500);

    // Set up Firebase Auth state listener
    // This is the PRIMARY authentication method using Firebase Phone Auth
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      console.log('[AuthContext] Firebase auth state changed:', 
        firebaseUser ? `uid=${firebaseUser.uid}, phone=${firebaseUser.phoneNumber}` : 'no user');
      
      setUser(firebaseUser);
      setLoading(false);
      setInitializing(false);
    });

    // Cleanup
    return () => {
      console.log('[AuthContext] Cleaning up auth state listener');
      unsubscribe();
      clearInterval(manualAuthInterval);
    };
  }, []);

  const value: AuthContextType = {
    user,
    manualAuth,
    loading,
    initializing,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
