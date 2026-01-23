// src/services/chatRoomService.ts

import firestore from '@react-native-firebase/firestore';
import { getChatRoomId } from '../utils/chatRoomId';

export const getOrCreateChatRoom = async (
  currentUserUid: string,
  otherUserUid: string
): Promise<string> => {
  // 1️⃣ Generate chatRoomId
  const chatRoomId = getChatRoomId(currentUserUid, otherUserUid);

  // 2️⃣ Reference to chat room document
  const chatRoomRef = firestore()
    .collection('chatRooms')
    .doc(chatRoomId);

  // 3️⃣ Check if chat room exists
  const chatRoomSnapshot = await chatRoomRef.get();

  // 4️⃣ If NOT exists → create it
  if (!chatRoomSnapshot.exists) {
    // Support self-chat: if both UIDs are the same, create with single participant
    const isSelfChat = currentUserUid === otherUserUid;
    const participants = isSelfChat ? [currentUserUid] : [currentUserUid, otherUserUid];
    
    const unreadCount: Record<string, number> = {
      [currentUserUid]: 0,
    };
    
    // Only add otherUserUid to unreadCount if it's not a self-chat
    if (!isSelfChat) {
      unreadCount[otherUserUid] = 0;
    }

    await chatRoomRef.set({
      participants,
      lastMessage: '',
      lastMessageTime: firestore.FieldValue.serverTimestamp(),
      unreadCount,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  // 5️⃣ Return chatRoomId (always)
  return chatRoomId;
};
