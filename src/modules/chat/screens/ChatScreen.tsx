import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useRoute } from '@react-navigation/native';

import { chatScreenStyles } from '../styles/ChatScreen.styles';
import { colors } from '../../../styles/colors';

type RouteParams = {
    chatId: string;
    chatName: string;
};

export const ChatScreen = () => {
    const route = useRoute<any>();
    const { chatId, chatName } = route.params as RouteParams;

    const currentUserUid = auth().currentUser?.uid;

    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState('');

    /* ==================== STEP 6: REAL-TIME LISTENER ==================== */
    useEffect(() => {
        if (!chatId) return;

        const unsubscribe = firestore()
            .collection('chatRooms')
            .doc(chatId)
            .collection('messages')
            .orderBy('createdAt', 'asc')
            .onSnapshot(snapshot => {
                const msgs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMessages(msgs);
            });

        return () => unsubscribe();
    }, [chatId]);

    /* ==================== STEP 8: MARK MESSAGES AS SEEN ==================== */
    useEffect(() => {
        if (!chatId || !currentUserUid) return;

        const markMessagesAsSeen = async () => {
            const chatRoomRef = firestore()
                .collection('chatRooms')
                .doc(chatId);

            const chatRoomSnap = await chatRoomRef.get();
            const chatRoomData = chatRoomSnap.data();
            
            if (!chatRoomData) return;

            const participants: string[] = chatRoomData.participants || [];
            const isSelfChat = participants.length === 1 && participants[0] === currentUserUid;

            const messagesRef = chatRoomRef.collection('messages');

            // For self-chat, mark all messages as seen immediately (sender = receiver)
            if (isSelfChat) {
                const unseenSnap = await messagesRef
                    .where('seen', '==', false)
                    .get();

                if (unseenSnap.empty) return;

                const batch = firestore().batch();

                unseenSnap.docs.forEach(doc => {
                    batch.update(doc.ref, {
                        seen: true,
                        seenAt: firestore.FieldValue.serverTimestamp(),
                    });
                });

                batch.update(chatRoomRef, {
                    [`unreadCount.${currentUserUid}`]: 0,
                });

                await batch.commit();
            } else {
                // Normal chat: only mark messages from other participants as seen
                const unseenSnap = await messagesRef
                    .where('seen', '==', false)
                    .where('senderId', '!=', currentUserUid)
                    .get();

                if (unseenSnap.empty) return;

                const batch = firestore().batch();

                unseenSnap.docs.forEach(doc => {
                    batch.update(doc.ref, {
                        seen: true,
                        seenAt: firestore.FieldValue.serverTimestamp(),
                    });
                });

                batch.update(chatRoomRef, {
                    [`unreadCount.${currentUserUid}`]: 0,
                });

                await batch.commit();
            }
        };

        markMessagesAsSeen();
    }, [chatId, currentUserUid]);

    /* ==================== STEP 7: SEND MESSAGE ==================== */
    const handleSendMessage = useCallback(async () => {
        if (!text.trim() || !currentUserUid) return;

        const messageText: string = text;
        setText('');

        const chatRoomRef = firestore()
            .collection('chatRooms')
            .doc(chatId);

        const messagesRef = chatRoomRef.collection('messages');

        const chatRoomSnap = await chatRoomRef.get();
        const chatRoomData = chatRoomSnap.data();

        if (!chatRoomData) return;

        const participants: string[] = chatRoomData.participants || [];
        const isSelfChat = participants.length === 1 && participants[0] === currentUserUid;
        
        // For normal chats, receiver is the other participant.
        // For self-chats, receiver is also the current user.
        const receiverUid =
            participants.find(uid => uid !== currentUserUid) ||
            currentUserUid;

        // For self-chat: messages are delivered immediately, then marked as seen after a short delay
        // This simulates WhatsApp behavior where you see single tick → double tick → blue ticks
        const seen = false; // Start as not seen, will be marked as seen shortly after
        
        const messageRef = await messagesRef.add({
            text: messageText,
            senderId: currentUserUid,
            createdAt: firestore.FieldValue.serverTimestamp(),
            seen: false,
            delivered: !isSelfChat, // For self-chat, delivered immediately
        });

        // For self-chat: mark as delivered immediately, then as seen after 1 second
        if (isSelfChat) {
            // Mark as delivered immediately
            await messageRef.update({
                delivered: true,
            });
            
            // Mark as seen after 1 second (simulates WhatsApp behavior)
            setTimeout(async () => {
                try {
                    await messageRef.update({
                        seen: true,
                        seenAt: firestore.FieldValue.serverTimestamp(),
                    });
                } catch (error) {
                    console.log('[ChatScreen] Error marking self-message as seen:', error);
                }
            }, 1000);
        }

        // For self-chat, don't increment unread count (already seen)
        const updateData: any = {
            lastMessage: messageText,
            lastMessageTime: firestore.FieldValue.serverTimestamp(),
        };

        if (!isSelfChat) {
            updateData[`unreadCount.${receiverUid}`] = firestore.FieldValue.increment(1);
        } else {
            // Ensure unread count stays at 0 for self-chat
            updateData[`unreadCount.${currentUserUid}`] = 0;
        }

        await chatRoomRef.update(updateData);
    }, [text, chatId, currentUserUid]);

    /* ==================== RENDER MESSAGE ==================== */
    const renderMessage = ({ item }: any) => {
        const isMe = item.senderId === currentUserUid;

        return (
            <View
                style={[
                    chatScreenStyles.messageBubble,
                    isMe
                        ? chatScreenStyles.myMessage
                        : chatScreenStyles.otherMessage,
                ]}
            >
                <Text style={chatScreenStyles.messageText}>
                    {item.text}
                </Text>

                {/* ✔ / ✔✔ ticks (ONLY for sender) */}
                {isMe && (
                    <View style={chatScreenStyles.tickContainer}>
                        <Text
                            style={[
                                chatScreenStyles.tickText,
                                item.seen && chatScreenStyles.tickSeen,
                            ]}
                        >
                            {item.seen ? '✔✔' : (item.delivered !== false ? '✔✔' : '✔')}
                        </Text>
                    </View>
                )}
            </View>
        );
    };


    /* ==================== UI ==================== */
    return (
        <SafeAreaView style={chatScreenStyles.container}>
            {/* Header */}
            <View style={chatScreenStyles.header}>
                <Text style={chatScreenStyles.headerTitle}>
                    {chatName}
                </Text>
            </View>

            {/* Messages */}
            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderMessage}
                contentContainerStyle={chatScreenStyles.messageList}
            />

            {/* Input */}
            <View style={chatScreenStyles.inputContainer}>
                <TextInput
                    style={chatScreenStyles.input}
                    placeholder="Type a message"
                    placeholderTextColor={colors.textSecondary}
                    value={text}
                    onChangeText={setText}
                />
                <TouchableOpacity
                    style={chatScreenStyles.sendButton}
                    onPress={handleSendMessage}
                    activeOpacity={0.8}
                >
                    <Text style={chatScreenStyles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
