import React, { useEffect, useState } from "react"
import { View, Image, Text, StatusBar } from "react-native"
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { isPhoneAuthInProgress } from "../services/phoneAuthState"
import { AuthStack } from "./AuthStack"
import { AppStack } from "./AppStack"
import { splashScreenStyles } from "../modules/auth/styles/SplashScreen.styles"

const AppNavigator: React.FC = () => {
  const [initializing, setInitializing] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [manualAuth, setManualAuth] = useState<boolean>(false);

  useEffect(() => {
    console.log('[AppNavigator] Setting up Firebase auth state listener & manual auth watcher...');
    
    // Keep native splash screen visible during initialization
    // It will be hidden after auth state is resolved

    // Initial manual auth check (fallback when Firebase fails)
    const checkManualAuthOnce = async () => {
      try {
        const isManual = await AsyncStorage.getItem('isManualAuth');
        if (isManual === 'true') {
          console.log('[AppNavigator] Manual auth detected on mount - allowing access');
          setManualAuth(true);
          setInitializing(false);
        }
      } catch (e) {
        console.warn('[AppNavigator] Failed to read manual auth state:', e);
      }
    };
    checkManualAuthOnce();

    // Lightweight interval to detect manual auth changes while app is running
    const intervalId = setInterval(async () => {
      try {
        const isManual = await AsyncStorage.getItem('isManualAuth');
        const enabled = isManual === 'true';
        setManualAuth(prev => (prev !== enabled ? enabled : prev));
      } catch (e) {
        // Non-fatal – just log once in a while if needed
      }
    }, 500);
    
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      console.log('[AppNavigator] onAuthStateChanged →',
        firebaseUser ? `uid=${firebaseUser.uid}, phone=${firebaseUser.phoneNumber}` : 'no user');
      setUser(firebaseUser);
      setInitializing(false);
    });

    return () => {
      console.log('[AppNavigator] Cleaning up auth state listener');
      unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  // During initialization, show splash screen
  if (initializing) {
    return (
      <View style={splashScreenStyles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={splashScreenStyles.content}>
          <View style={splashScreenStyles.logoContainer}>
            <Image
              source={require("../assets/images/whatsapp-logo.png")}
              style={splashScreenStyles.whatsappLogoImage}
              resizeMode="contain"
            />
          </View>
          <View style={splashScreenStyles.footer}>
            <Text style={splashScreenStyles.footerText}>from</Text>
            <View style={splashScreenStyles.metaContainer}>
              <Text style={splashScreenStyles.metaIcon}>∞</Text>
              <Text style={splashScreenStyles.metaText}>Meta</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  const phoneAuthInProgress = isPhoneAuthInProgress();

  // If Firebase has an authenticated user but phone auth is still in progress,
  // show minimal view (native splash already hidden at this point)
  if (user && phoneAuthInProgress) {
    console.log('[AppNavigator] User authenticated but phone auth still in progress');
    return null; // Minimal view - navigation will happen soon
  }

  // If Firebase has an authenticated user and no phone-auth flow is active, show AppStack
  if (user) {
    console.log('[AppNavigator] Authenticated user found - showing AppStack. uid:', user.uid);
    return <AppStack />;
  }

  // If manual auth is enabled (Firebase fallback), show AppStack
  if (manualAuth) {
    console.log('[AppNavigator] Manual auth enabled - showing AppStack (Firebase fallback mode)');
    return <AppStack />;
  }

  // Otherwise show AuthStack (registration flow)
  console.log('[AppNavigator] No authenticated user - showing AuthStack');
  return <AuthStack />;
}

export default AppNavigator