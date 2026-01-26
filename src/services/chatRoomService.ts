// src/services/chatRoomService.ts

import firestore from '@react-native-firebase/firestore';
import { getChatRoomId } from '../utils/chatRoomId';

export const getOrCreateChatRoom = async (
  currentUserUid: string,
  otherUserUid: string
): Promise<string> => {
  try {
    console.log('[chatRoomService] Creating/getting chat room - currentUserUid:', currentUserUid, 'otherUserUid:', otherUserUid);
    
    // Ensure we have valid UIDs
    if (!currentUserUid || !otherUserUid) {
      throw new Error('Invalid user UIDs provided');
    }
    
    // 1️⃣ Generate chatRoomId
    const chatRoomId = getChatRoomId(currentUserUid, otherUserUid);
    console.log('[chatRoomService] Generated chatRoomId:', chatRoomId);

    // 2️⃣ Reference to chat room document
    const chatRoomRef = firestore()
      .collection('chatRooms')
      .doc(chatRoomId);

    // 3️⃣ Check if chat room exists (with fallback if permission denied)
    let chatRoomExists = false;
    try {
      const chatRoomSnapshot = await chatRoomRef.get();
      chatRoomExists = typeof (chatRoomSnapshot as any).exists === 'function'
        ? !!(chatRoomSnapshot as any).exists()
        : !!(chatRoomSnapshot as any).exists;
      console.log('[chatRoomService] Chat room exists:', chatRoomExists);
    } catch (getError: any) {
      console.error('[chatRoomService] Error checking chat room existence:', getError);
      console.error('[chatRoomService] Get error code:', getError?.code);
      // If it's a permission error, assume it doesn't exist and try to create
      // This handles cases where rules allow create but not read
      if (getError?.code === 'permission-denied') {
        console.log('[chatRoomService] Permission denied on get - will try to create (rules may allow create but not read)');
        chatRoomExists = false;
      } else {
        // For other errors, still try to create (might be a new room)
        console.log('[chatRoomService] Error on get, will try to create anyway');
        chatRoomExists = false;
      }
    }

    // 4️⃣ If NOT exists → create it (or update if it exists but we couldn't read it)
    if (!chatRoomExists) {
      // Support self-chat: if both UIDs are the same, create with single participant
      const isSelfChat = currentUserUid === otherUserUid;
      console.log('[chatRoomService] Is self-chat:', isSelfChat);
      
      const participants = isSelfChat ? [currentUserUid] : [currentUserUid, otherUserUid];
      
      const unreadCount: Record<string, number> = {
        [currentUserUid]: 0,
      };
      
      // Only add otherUserUid to unreadCount if it's not a self-chat
      if (!isSelfChat) {
        unreadCount[otherUserUid] = 0;
      }

      const chatRoomData = {
        participants,
        lastMessage: '',
        lastMessageTime: firestore.FieldValue.serverTimestamp(),
        unreadCount,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      
      console.log('[chatRoomService] Creating chat room with data:', JSON.stringify(chatRoomData, null, 2));
      
      try {
        // Use set (not merge) to create new room, but catch if it already exists
        await chatRoomRef.set(chatRoomData);
        console.log('[chatRoomService] ✅ Chat room created successfully');
      } catch (createError: any) {
        console.error('[chatRoomService] Error creating chat room:', createError);
        console.error('[chatRoomService] Create error code:', createError?.code);
        console.error('[chatRoomService] Create error message:', createError?.message);
        
        // If it's a permission error, provide helpful message about deploying rules
        if (createError?.code === 'permission-denied') {
          const errorMsg = 'Firestore permission denied. Please deploy Firestore security rules:\n\n' +
            '1. Open Firebase Console → Firestore Database → Rules\n' +
            '2. Copy contents from firestore.rules file\n' +
            '3. Paste and click "Publish"\n' +
            '4. Wait 10-20 seconds, then reload app';
          throw new Error(errorMsg);
        }
        
        // If room already exists (shouldn't happen, but handle gracefully)
        if (createError?.code === 'already-exists' || createError?.message?.includes('already exists')) {
          console.log('[chatRoomService] Chat room already exists (race condition), returning ID');
          return chatRoomId;
        }
        
        throw createError;
      }
    } else {
      console.log('[chatRoomService] ✅ Chat room already exists, reusing');
    }

    // 5️⃣ Return chatRoomId (always)
    console.log('[chatRoomService] Returning chatRoomId:', chatRoomId);
    return chatRoomId;
  } catch (error: any) {
    console.error('[chatRoomService] Error creating/getting chat room:', error);
    console.error('[chatRoomService] Error message:', error?.message);
    console.error('[chatRoomService] Error code:', error?.code);
    throw error; // Re-throw to let caller handle it
  }
};
