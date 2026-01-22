import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../modules/auth/screens/SplashScreen';
import { PrivacyPolicyScreen } from '../modules/auth/screens/PrivacyPolicyScreen';
import { PhoneVerificationScreen } from '../modules/auth/screens/PhoneVerificationScreen';
import { OTPVerificationScreen } from '../modules/auth/screens/OTPVerificationScreen';
import type { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AuthStack: React.FC = () => {

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'transparent' },
      }}
      initialRouteName="Splash"
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="PhoneVerification"
        component={PhoneVerificationScreen}
        options={{
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="OTPVerification"
        component={OTPVerificationScreen}
        options={{
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};
