import React, { useEffect, useState } from "react"
import { View, Image, Text, StatusBar } from "react-native"
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { AuthStack } from "./AuthStack"
import { AppStack } from "./AppStack"
import { splashScreenStyles } from "../modules/auth/styles/SplashScreen.styles"
import { useTheme } from "../contexts/ThemeContext"

const AppNavigator: React.FC = () => {
  const [initializing, setInitializing] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const { theme, isDark } = useTheme();

  useEffect(() => {
    console.log('[AppNavigator] Setting up Firebase auth state listener...');
    
    // Keep native splash screen visible during initialization
    // It will be hidden after auth state is resolved
    
    // Set up Firebase Auth state listener - ONLY authentication method
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      console.log('[AppNavigator] onAuthStateChanged →',
        firebaseUser ? `uid=${firebaseUser.uid}, phone=${firebaseUser.phoneNumber}` : 'no user');
      setUser(firebaseUser);
      setInitializing(false);
    });

    return () => {
      console.log('[AppNavigator] Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  // During initialization, show splash screen
  if (initializing) {
    return (
      <View style={[splashScreenStyles.container, { backgroundColor: theme.background }]}>
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <View style={splashScreenStyles.content}>
          <View style={splashScreenStyles.logoContainer}>
            <Image
              source={require("../assets/images/whatsapp-logo.png")}
              style={splashScreenStyles.whatsappLogoImage}
              resizeMode="contain"
            />
          </View>
          <View style={splashScreenStyles.footer}>
            <Text style={[splashScreenStyles.footerText, { color: theme.textTertiary }]}>from</Text>
            <View style={splashScreenStyles.metaContainer}>
              <Text style={[splashScreenStyles.metaIcon, { color: theme.whatsappGreen }]}>∞</Text>
              <Text style={[splashScreenStyles.metaText, { color: theme.whatsappGreen }]}>Meta</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // CRITICAL FIX: Remove phoneAuthInProgress check that caused blank screen
  // The issue: phoneAuthInProgress is a module variable, not reactive state
  // When it changes, React doesn't re-render, causing AppNavigator to return null
  // Solution: Rely only on Firebase auth state (user) which is reactive
  
  // If Firebase has an authenticated user, show AppStack immediately
  if (user) {
    console.log('[AppNavigator] Authenticated user found - showing AppStack. uid:', user.uid);
    return <AppStack />;
  }

  // Otherwise show AuthStack (registration flow)
  console.log('[AppNavigator] No authenticated user - showing AuthStack');
  return <AuthStack />;
}

export default AppNavigator