import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RouteProp } from "@react-navigation/native"
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"

export type RootStackParamList = {
  Splash: undefined
  PrivacyPolicy: undefined;
  MainTabs: undefined
  PhoneVerification: undefined;
  OTPVerification: {
    phoneNumber: string;
    countryCode: string;
  };
  Settings: undefined;
  Profile: undefined;
  ChatDetail: { chatId: string; chatName: string }
}

export type BottomTabParamList = {
  Updates: undefined
  Calls: undefined
  Communities: undefined
  Chats: undefined
}

export type RootNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, T>

export type RootRouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>

export type TabNavigationProp<T extends keyof BottomTabParamList> = BottomTabNavigationProp<BottomTabParamList, T>
