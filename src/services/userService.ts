/**
 * User Service
 * Handles Firestore user profile operations (uid-based identity, phoneNumber stored as field)
 */

import firestore from '@react-native-firebase/firestore';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

export interface UserData {
  uid: string;
  phoneNumber: string;
  countryCode?: string;
  isVerified: boolean;
  createdAt: any; // Firestore Timestamp
  lastLogin: any; // Firestore Timestamp
}

/**
 * Create or update user in Firestore, using Firebase Auth uid as document ID.
 * - If user doc does not exist: create users/{uid} and set createdAt + lastLogin.
 * - If user doc exists: update lastLogin (and phone fields), preserve existing chats.
 */
export const createOrUpdateUser = async (
  user: FirebaseAuthTypes.User,
  phoneNumber: string,
  countryCode?: string
): Promise<UserData> => {
  const uid = user.uid;

  try {
    console.log('[userService] 📄 Creating/updating user in Firestore for uid:', uid, 'phone:', phoneNumber);
    const db = firestore();
    const userRef = db.collection('users').doc(uid);

    const userData: Partial<UserData> = {
      uid,
      phoneNumber,
      countryCode: countryCode || '',
      isVerified: true,
      lastLogin: firestore.FieldValue.serverTimestamp(),
    };

    // Check if user exists
    const userDoc = await userRef.get();
    const exists =
      typeof (userDoc as any).exists === 'function'
        ? !!(userDoc as any).exists()
        : !!(userDoc as any).exists;

    if (!exists) {
      console.log('[userService] ➕ User does not exist, creating new document');
      // Create new user
      userData.createdAt = firestore.FieldValue.serverTimestamp();
      await userRef.set(userData);
      console.log('[userService] ✅ New user created:', uid);
      
      // Initialize chats for new user
      try {
        const { initializeUserChats } = require('./chatService');
        await initializeUserChats(uid);
        console.log('[userService] ✅ Chats initialized for new user');
      } catch (chatError: any) {
        console.log('[userService] ⚠️ Failed to initialize chats (non-critical):', chatError?.message);
      }
    } else {
      console.log('[userService] 🔁 User exists, updating lastLogin only');
      // Update existing user (lastLogin, phone fields)
      await userRef.update(userData);
      console.log('[userService] ✅ User updated:', uid);
    }

    return {
      uid,
      phoneNumber,
      countryCode: countryCode || '',
      isVerified: true,
      createdAt: exists ? userDoc.data()?.createdAt : null,
      lastLogin: null, // Will be set by serverTimestamp
    };
  } catch (error: any) {
    console.log('[userService] Error creating/updating user (non-fatal):', error?.message);
    // Surface minimal safe fallback - caller treats this as non-fatal
    return {
      uid,
      phoneNumber,
      countryCode: countryCode || '',
      isVerified: false,
      createdAt: null,
      lastLogin: null,
    };
  }
};

/**
 * Get user data from Firestore by uid
 */
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const db = firestore();
    const userDoc = await db.collection('users').doc(uid).get();
    const exists =
      typeof (userDoc as any).exists === 'function'
        ? !!(userDoc as any).exists()
        : !!(userDoc as any).exists;

    if (exists) {
      const data = userDoc.data() as UserData;
      console.log('[userService] ✅ User data retrieved:', uid);
      return data;
    }

    console.log('[userService] User not found:', uid);
    return null;
  } catch (error: any) {
    console.log('[userService] Error getting user data:', error?.message);
    return null;
  }
};

/**
 * Check if user exists by phone number and return user data
 */
export const getUserByPhoneNumber = async (phoneNumber: string): Promise<UserData | null> => {
  try {
    const db = firestore();
    const querySnapshot = await db
      .collection('users')
      .where('phoneNumber', '==', phoneNumber)
      .limit(1)
      .get();
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = { uid: doc.id, ...doc.data() } as UserData;
      console.log('[userService] ✅ User found by phone number:', phoneNumber, 'uid:', doc.id);
      return data;
    }
    
    console.log('[userService] User not found by phone number:', phoneNumber);
    return null;
  } catch (error: any) {
    console.error('[userService] Error getting user by phone number:', error);
    return null;
  }
};

