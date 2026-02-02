import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { ChatScreen } from '../modules/chat/screens/ChatScreen';
import { SettingsScreen } from '../modules/settings/screens/SettingsScreen';
import { ProfileScreen } from '../modules/settings/screens/ProfileScreen';
import { ChatsSettingsScreen } from '../modules/settings/screens/ChatsSettingsScreen';
import { NewChatScreen } from '../modules/chat/screens/NewChatScreen';
import { ContactProfileScreen } from '../modules/chat/screens/ContactProfileScreen';
import { useBackHandler } from '../hooks/useBackHandler';
import type { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppStack: React.FC = () => {
  // Enable back handler for AppStack
  useBackHandler(true);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'transparent' },
      }}
      initialRouteName="MainTabs"
    >
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{
          animation: 'slide_from_right',
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="ChatDetail"
        component={ChatScreen}
        options={{
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      />

      {/* ✅ NEW CHAT SCREEN */}
      <Stack.Screen
        name="NewChat"
        component={NewChatScreen}
        options={{
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      />

      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      />

      <Stack.Screen
        name="ChatsSettings"
        component={ChatsSettingsScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      />

      <Stack.Screen
        name="ContactProfile"
        component={ContactProfileScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};
