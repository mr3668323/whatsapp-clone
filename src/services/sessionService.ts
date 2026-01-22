import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_PHONE_KEY = '@whatsapp_phoneNumber';
const SESSION_LOGGED_IN_KEY = '@whatsapp_isLoggedIn';

export const saveSession = async (phoneNumber: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(SESSION_PHONE_KEY, phoneNumber);
    await AsyncStorage.setItem(SESSION_LOGGED_IN_KEY, 'true');
    console.log('[sessionService] ✅ Session saved for phone:', phoneNumber);
  } catch (error: any) {
    console.error('[sessionService] ❌ Error saving session:', error);
  }
};

export const clearSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SESSION_PHONE_KEY);
    await AsyncStorage.removeItem(SESSION_LOGGED_IN_KEY);
    console.log('[sessionService] ✅ Session cleared');
  } catch (error: any) {
    console.error('[sessionService] ❌ Error clearing session:', error);
  }
};

export const getSessionPhoneNumber = async (): Promise<string | null> => {
  try {
    const phone = await AsyncStorage.getItem(SESSION_PHONE_KEY);
    return phone;
  } catch (error: any) {
    console.error('[sessionService] ❌ Error getting session phone number:', error);
    return null;
  }
};

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(SESSION_LOGGED_IN_KEY);
    return value === 'true';
  } catch (error: any) {
    console.error('[sessionService] ❌ Error checking login state:', error);
    return false;
  }
};

