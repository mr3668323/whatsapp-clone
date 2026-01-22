import { useEffect, useRef } from 'react';
import { BackHandler, ToastAndroid, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

let backPressCount = 0;
let backPressTimer: ReturnType<typeof setTimeout> | null = null;

export const useBackHandler = (enabled: boolean = true) => {
  const navigation = useNavigation();
  const backPressCountRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const backAction = () => {
      const state = navigation.getState();
      if (!state || !state.routes || state.index === undefined) {
        return false; // Allow default back action if state is invalid
      }
      const currentRoute = state.routes[state.index];
      if (!currentRoute) {
        return false; // Allow default back action if route is invalid
      }
      const currentRouteName = currentRoute.name;

      // If we're on MainTabs (Home screen), handle double back press to exit
      if (currentRouteName === 'MainTabs') {
        const tabState = (currentRoute as any).state;
        if (!tabState) {
          return false; // Allow default back action if no tab state
        }
        const tabIndex = tabState.index || 0;
        const tabRoute = tabState.routes?.[tabIndex];
        const tabRouteName = tabRoute?.name;

        // Only handle back button on the main tab screens (Chats, Updates, etc.)
        if (tabRouteName === 'Chats' || tabRouteName === 'Updates' || 
            tabRouteName === 'Communities' || tabRouteName === 'Calls') {
          
          backPressCountRef.current += 1;

          if (backPressCountRef.current === 1) {
            // First back press - show toast
            if (Platform.OS === 'android') {
              ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
            }

            // Reset counter after 2 seconds
            if (backPressTimer) {
              clearTimeout(backPressTimer);
            }
            backPressTimer = setTimeout(() => {
              backPressCountRef.current = 0;
            }, 2000);
          } else if (backPressCountRef.current >= 2) {
            // Second back press - exit app
            backPressCountRef.current = 0;
            if (backPressTimer) {
              clearTimeout(backPressTimer);
            }
            BackHandler.exitApp();
            return true;
          }

          return true; // Prevent default back action
        }
      }

      // For other screens, allow normal back navigation
      // But prevent going back to AuthStack screens if user is logged in
      const authScreens = ['Splash', 'PrivacyPolicy', 'PhoneVerification', 'OTPVerification'];
      if (authScreens.includes(currentRouteName)) {
        // Prevent going back to auth screens
        return true;
      }

      return false; // Allow default back action
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
      if (backPressTimer) {
        clearTimeout(backPressTimer);
      }
    };
  }, [navigation, enabled]);
};
