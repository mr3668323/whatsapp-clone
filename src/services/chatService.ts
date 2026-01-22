/**
 * Chat Service
 * Handles Firestore chat operations (uid-based)
 */

import firestore from '@react-native-firebase/firestore';
import type { UserData } from './userService';
import { dummyChats } from '../data/dummyChats';

export type ChatData = UserData extends { chats: infer T } ? T : typeof dummyChats[number];

/**
 * Initialize chats for a new user (only if chats/{uid} does NOT exist).
 */
export const initializeUserChats = async (uid: string): Promise<void> => {
  try {
    console.log('[chatService] 💬 Checking/initializing chats for uid:', uid);
    const db = firestore();
    const chatsRef = db.collection('chats').doc(uid);
    const snapshot = await chatsRef.get();

    const exists =
      typeof (snapshot as any).exists === 'function'
        ? !!(snapshot as any).exists()
        : !!(snapshot as any).exists;

    if (exists) {
      console.log('[chatService] ℹ️ Chats already exist for uid:', uid, '- not overwriting');
      return;
    }

    await chatsRef.set({
      userId: uid,
      chats: dummyChats,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    console.log('[chatService] ✅ Chats initialized in Firestore for uid:', uid);
  } catch (error: any) {
    console.log('[chatService] Error initializing chats:', error?.message);
  }
};

/**
 * Get chats for a user (uid-based), falling back to dummyChats.
 */
export const getUserChats = async (uid: string): Promise<ChatData[]> => {
  try {
    console.log('[chatService] 📥 Fetching chats from Firestore for uid:', uid);
    const db = firestore();
    const chatsDoc = await db.collection('chats').doc(uid).get();

    const exists =
      typeof (chatsDoc as any).exists === 'function'
        ? !!(chatsDoc as any).exists()
        : !!(chatsDoc as any).exists;

    if (exists) {
      const data = chatsDoc.data();
      const chats = (data?.chats || []) as ChatData[];
      console.log('[chatService] ✅ Chats retrieved for uid:', uid, 'Count:', chats.length);
      return chats;
    }

    console.log('[chatService] ℹ️ No chats found in Firestore for uid:', uid, '- returning dummyChats');
    return dummyChats as ChatData[];
  } catch (error: any) {
    console.warn('[chatService] Error getting chats (non-fatal):', error);
    return dummyChats as ChatData[];
  }
};
