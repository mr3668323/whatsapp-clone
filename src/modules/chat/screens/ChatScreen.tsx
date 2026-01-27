import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

import { chatScreenStyles } from '../styles/ChatScreen.styles';
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { DateSeparator } from '../../../components/chat/DateSeparator';
import { formatMessageTime, formatDateSeparator, timestampToDate, isSameDay } from '../../../utils/dateUtils';
import { MetaAIAvatar } from '../../../components/chat/MetaAIAvatar';
import { MetaAIFirstTimeScreen } from '../../../components/chat/MetaAIFirstTimeScreen';
import { ChatMenu } from '../../../components/chat/ChatMenu';
import { sendMessageToMetaAI } from '../../../services/metaAIService';
import { getUserData } from '../../../services/userService';
import { getChatRoomId } from '../../../utils/chatRoomId';

type RouteParams = {
    chatId: string;
    chatName: string;
};

export const ChatScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    let { chatId, chatName } = route.params as RouteParams;
    
    // Treat both the initial frontend chatId ('meta_ai_chat') and the
    // backend Firestore chatId pattern ('meta_ai_chat_<userId>') as Meta AI chats
    const isMetaAIChat = chatId === 'meta_ai_chat' || chatId.startsWith('meta_ai_chat_');
    
    // CRITICAL FIX: Ensure chatRoomId is always sorted for normal chats
    // This ensures User A and User B always use the same chatRoomId
    if (!isMetaAIChat && chatId.includes('_')) {
        const parts = chatId.split('_');
        if (parts.length === 2) {
            const sortedChatId = getChatRoomId(parts[0], parts[1]);
            if (sortedChatId !== chatId) {
                console.warn('[ChatScreen] ⚠️ chatId was not sorted! Correcting:', chatId, '→', sortedChatId);
                chatId = sortedChatId;
            }
        }
    }

    // Get current user UID (handles both Firebase Auth and manual auth)
    const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);
    const [isSelfChat, setIsSelfChat] = useState(false);
    const [otherUserPhone, setOtherUserPhone] = useState<string>('');
    const [otherUserUid, setOtherUserUid] = useState<string | null>(null);

    useEffect(() => {
        const getCurrentUserUid = async () => {
            // Priority 1: Firebase Auth user
            const firebaseUser = auth().currentUser;
            if (firebaseUser?.uid) {
                setCurrentUserUid(firebaseUser.uid);
                return;
            }

            // Priority 2: Manual auth (test OTP - Firestore-only)
            const manualAuthPhone = await AsyncStorage.getItem('manualAuthPhoneNumber');
            if (manualAuthPhone) {
                setCurrentUserUid(manualAuthPhone);
                return;
            }

            setCurrentUserUid(null);
        };

        getCurrentUserUid();

        // Also listen to auth state changes
        const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
            if (firebaseUser?.uid) {
                setCurrentUserUid(firebaseUser.uid);
            } else {
                AsyncStorage.getItem('manualAuthPhoneNumber').then((manualAuthPhone) => {
                    if (manualAuthPhone) {
                        setCurrentUserUid(manualAuthPhone);
                    } else {
                        setCurrentUserUid(null);
                    }
                });
            }
        });

        return () => unsubscribe();
    }, []);

    // Get chat room data to determine if self-chat (skip for Meta AI)
    useEffect(() => {
        if (!chatId || !currentUserUid) return;
        
        // For Meta AI, set participants and skip Firestore
        if (isMetaAIChat) {
            setParticipants([currentUserUid, 'meta_ai']);
            setIsSelfChat(false);
            return;
        }

        const unsubscribe = firestore()
            .collection('chatRooms')
            .doc(chatId)
            .onSnapshot(snapshot => {
                const data = snapshot.data();
                if (data) {
                    const participants: string[] = data.participants || [];
                    setParticipants(participants);
                    const selfChat = participants.length === 1 && participants[0] === currentUserUid;
                    setIsSelfChat(selfChat);
                    
                    // Get other user phone if not self-chat
                    if (!selfChat) {
                        const otherUid = participants.find(uid => uid !== currentUserUid);
                        if (otherUid) {
                            setOtherUserUid(otherUid);
                            // Use userService to get phone number (with proper fallbacks)
                            getUserData(otherUid)
                                .then(userData => {
                                    if (userData?.phoneNumber) {
                                        setOtherUserPhone(userData.phoneNumber);
                                    } else {
                                        // Fallback: use UID if it looks like a phone number, otherwise show UID
                                        setOtherUserPhone(otherUid.startsWith('+') ? otherUid : otherUid);
                                    }
                                })
                                .catch(() => {
                                    // Final fallback: use UID
                                    setOtherUserPhone(otherUid);
                                });
                        }
                    } else {
                        setOtherUserUid(null);
                        // For self-chat, get current user's phone
                        getUserData(currentUserUid)
                            .then(userData => {
                                if (userData?.phoneNumber) {
                                    setOtherUserPhone(userData.phoneNumber);
                                } else {
                                    setOtherUserPhone(currentUserUid.startsWith('+') ? currentUserUid : currentUserUid);
                                }
                            })
                            .catch(() => {
                                setOtherUserPhone(currentUserUid);
                            });
                    }
                }
            });

        return () => unsubscribe();
    }, [chatId, currentUserUid, isMetaAIChat]);

    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState('');
    const prevTextRef = useRef('');
    // Store participants for tick logic
    const [participants, setParticipants] = useState<string[]>([]);
    // User name for Meta AI greeting
    const [userName, setUserName] = useState<string>('');
    // Menu visibility
    const [menuVisible, setMenuVisible] = useState(false);

    // Removed formatDate - using formatDateSeparator from dateUtils instead

    /* ==================== LOAD USER NAME FOR META AI ==================== */
    useEffect(() => {
        if (!isMetaAIChat || !currentUserUid) return;

        const loadUserName = async () => {
            try {
                const userDoc = await firestore()
                    .collection('users')
                    .doc(currentUserUid)
                    .get();
                
                const userData = userDoc.data();
                if (userData) {
                    setUserName(userData.displayName || userData.phoneNumber || 'User');
                } else {
                    setUserName(currentUserUid);
                }
            } catch (error) {
                console.log('[ChatScreen] Error loading user name:', error);
                setUserName(currentUserUid);
            }
        };

        loadUserName();
    }, [isMetaAIChat, currentUserUid]);

    /* ==================== REAL-TIME LISTENER ==================== */
    useEffect(() => {
        if (!chatId) return;

        // For Meta AI chat, load from Firestore (backend stores messages there)
        if (isMetaAIChat && currentUserUid) {
            const metaAIChatRoomId = `meta_ai_chat_${currentUserUid}`;
            console.log('[ChatScreen] Setting up Meta AI messages listener for:', metaAIChatRoomId);
            
            // Try Firestore first (backend stores messages there)
            const unsubscribe = firestore()
                .collection('chatRooms')
                .doc(metaAIChatRoomId)
                .collection('messages')
                .orderBy('createdAt', 'asc')
                .onSnapshot(
                    snapshot => {
                        if (snapshot.docs.length > 0) {
                            const msgs = snapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data(),
                            }));
                            
                            // Deduplicate messages by text, senderId, and timestamp
                            // This prevents duplicate AI responses
                            const uniqueMsgs = msgs.reduce((acc: any[], msg: any) => {
                                // Check if we already have a message with the same text, senderId, and similar timestamp
                                const isDuplicate = acc.some((existing: any) => {
                                    const sameText = existing.text === msg.text;
                                    const sameSender = existing.senderId === msg.senderId;
                                    // Consider messages within 2 seconds as potential duplicates
                                    const timeDiff = Math.abs(
                                        (existing.createdAt?.toMillis?.() || 0) - 
                                        (msg.createdAt?.toMillis?.() || 0)
                                    );
                                    const sameTime = timeDiff < 2000;
                                    return sameText && sameSender && sameTime;
                                });
                                
                                if (!isDuplicate) {
                                    acc.push(msg);
                                }
                                
                                return acc;
                            }, []);
                            
                            // Filter out temporary messages (those with temp_ prefix) when we have real Firestore messages
                            const finalMsgs = uniqueMsgs.filter((msg: any) => !msg.id?.startsWith('temp_'));
                            
                            console.log('[ChatScreen] Meta AI messages loaded from Firestore:', finalMsgs.length, '(deduplicated from', msgs.length, ')');
                            setMessages(finalMsgs);
                            
                            // Also save to AsyncStorage as backup
                            const serializable = msgs.map((msg: any) => ({
                                ...msg,
                                createdAt: msg.createdAt?.toDate ? msg.createdAt.toDate().toISOString() : msg.createdAt,
                            }));
                            AsyncStorage.setItem(`meta_ai_messages_${currentUserUid}`, JSON.stringify(serializable)).catch(
                                (error) => console.log('[ChatScreen] Error saving Meta AI messages to AsyncStorage:', error)
                            );
                        } else {
                            // Fallback to AsyncStorage if Firestore is empty
                            const loadFromAsyncStorage = async () => {
                                try {
                                    const stored = await AsyncStorage.getItem(`meta_ai_messages_${currentUserUid}`);
                                    if (stored) {
                                        const parsed = JSON.parse(stored);
                                        const messagesWithTimestamps = parsed.map((msg: any) => {
                                            if (msg.createdAt && typeof msg.createdAt === 'string') {
                                                msg.createdAt = firestore.Timestamp.fromDate(new Date(msg.createdAt));
                                            }
                                            return msg;
                                        });
                                        console.log('[ChatScreen] Meta AI messages loaded from AsyncStorage:', messagesWithTimestamps.length);
                                        setMessages(messagesWithTimestamps);
                                    }
                                } catch (error) {
                                    console.log('[ChatScreen] Error loading Meta AI messages from AsyncStorage:', error);
                                }
                            };
                            loadFromAsyncStorage();
                        }
                    },
                    error => {
                        console.error('[ChatScreen] Error loading Meta AI messages from Firestore:', error);
                        // Fallback to AsyncStorage on error
                        const loadFromAsyncStorage = async () => {
                            try {
                                const stored = await AsyncStorage.getItem(`meta_ai_messages_${currentUserUid}`);
                                if (stored) {
                                    const parsed = JSON.parse(stored);
                                    const messagesWithTimestamps = parsed.map((msg: any) => {
                                        if (msg.createdAt && typeof msg.createdAt === 'string') {
                                            msg.createdAt = firestore.Timestamp.fromDate(new Date(msg.createdAt));
                                        }
                                        return msg;
                                    });
                                    setMessages(messagesWithTimestamps);
                                }
                            } catch (err) {
                                console.log('[ChatScreen] Error loading from AsyncStorage fallback:', err);
                            }
                        };
                        loadFromAsyncStorage();
                    }
                );
            
            return () => unsubscribe();
        }

        console.log('[ChatScreen] Setting up messages listener for chatId:', chatId);
        
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
                console.log('[ChatScreen] Messages loaded:', msgs.length, 'messages');
                setMessages(msgs);
            }, error => {
                console.error('[ChatScreen] Error loading messages:', error);
            });

        return () => unsubscribe();
    }, [chatId, isMetaAIChat, currentUserUid]);

    /* ==================== MARK MESSAGES AS SEEN ==================== */
    useEffect(() => {
        if (!chatId || !currentUserUid || isMetaAIChat) return; // Skip for Meta AI

        const markMessagesAsSeen = async () => {
            try {
                const chatRoomRef = firestore()
                    .collection('chatRooms')
                    .doc(chatId);

                const chatRoomSnap = await chatRoomRef.get();
                const chatRoomData = chatRoomSnap.data();
                
                if (!chatRoomData) return;

                const participants: string[] = chatRoomData.participants || [];
                const selfChat = participants.length === 1 && participants[0] === currentUserUid;
                const otherUserUid = selfChat ? currentUserUid : participants.find(uid => uid !== currentUserUid);

                const messagesRef = chatRoomRef.collection('messages');

                // Update lastMessage.seenBy array when marking messages as seen
                const updateLastMessageSeenBy = async () => {
                    try {
                        const chatRoomData = (await chatRoomRef.get()).data();
                        if (!chatRoomData?.lastMessage) return;
                        
                        // Handle both string and object formats for lastMessage
                        let lastMessage = chatRoomData.lastMessage;
                        if (typeof lastMessage === 'string') {
                            // If lastMessage is a string, we need to get it from the actual last message
                            const lastMsgSnap = await messagesRef
                                .orderBy('createdAt', 'desc')
                                .limit(1)
                                .get();
                            
                            if (!lastMsgSnap.empty) {
                                const lastMsgData = lastMsgSnap.docs[0].data();
                                lastMessage = {
                                    text: lastMsgData.text,
                                    senderId: lastMsgData.senderId,
                                    timestamp: lastMsgData.createdAt,
                                    seenBy: lastMsgData.seenBy || [],
                                };
                            } else {
                                return;
                            }
                        }
                        
                        const seenBy = lastMessage.seenBy || [];
                        
                        // Only mark as seen if it's a message from the other user
                        if (lastMessage.senderId !== currentUserUid && !seenBy.includes(currentUserUid)) {
                            seenBy.push(currentUserUid);
                            await chatRoomRef.update({
                                'lastMessage.seenBy': seenBy,
                            });
                            console.log('[ChatScreen] ✅ Marked lastMessage as seen');
                        }
                    } catch (error) {
                        console.error('[ChatScreen] Error updating lastMessage seenBy:', error);
                    }
                };

                // For self-chat: mark all messages as seen immediately
                if (selfChat) {
                    // Get all messages that haven't been seen by current user
                    const allMessagesSnap = await messagesRef.get();
                    const unseenMessages = allMessagesSnap.docs.filter(doc => {
                        const data = doc.data();
                        const seenBy = data.seenBy || [];
                        return !seenBy.includes(currentUserUid);
                    });

                    if (unseenMessages.length > 0) {
                        const batch = firestore().batch();

                        unseenMessages.forEach(doc => {
                            const data = doc.data();
                            const currentSeenBy = data.seenBy || [];
                            if (!currentSeenBy.includes(currentUserUid)) {
                                currentSeenBy.push(currentUserUid);
                            }
                            batch.update(doc.ref, {
                                seen: true,
                                seenAt: firestore.FieldValue.serverTimestamp(),
                                seenBy: currentSeenBy,
                            });
                        });

                        batch.update(chatRoomRef, {
                            [`unreadCount.${currentUserUid}`]: 0,
                        });

                        await batch.commit();
                        console.log('[ChatScreen] ✅ Marked', unseenMessages.length, 'self-chat messages as seen');
                    }
                    
                    await updateLastMessageSeenBy();
                } else {
                    // Normal chat: only mark messages from other participants as seen
                    // Get all messages from other user that haven't been seen by current user
                    const allMessagesSnap = await messagesRef
                        .where('senderId', '==', otherUserUid)
                        .get();

                    const unseenMessages = allMessagesSnap.docs.filter(doc => {
                        const data = doc.data();
                        const seenBy = data.seenBy || [];
                        return !seenBy.includes(currentUserUid);
                    });

                    if (unseenMessages.length > 0) {
                        const batch = firestore().batch();

                        unseenMessages.forEach(doc => {
                            const data = doc.data();
                            const currentSeenBy = data.seenBy || [];
                            if (!currentSeenBy.includes(currentUserUid)) {
                                currentSeenBy.push(currentUserUid);
                            }
                            batch.update(doc.ref, {
                                seen: true,
                                seenAt: firestore.FieldValue.serverTimestamp(),
                                seenBy: currentSeenBy,
                            });
                        });

                        batch.update(chatRoomRef, {
                            [`unreadCount.${currentUserUid}`]: 0,
                        });

                        await batch.commit();
                        console.log('[ChatScreen] ✅ Marked', unseenMessages.length, 'messages from other user as seen');
                    }
                    
                    await updateLastMessageSeenBy();
                }
            } catch (error) {
                console.error('[ChatScreen] Error marking messages as seen:', error);
            }
        };

        // Mark messages as seen when chat opens
        markMessagesAsSeen();
    }, [chatId, currentUserUid]);

    /* ==================== SEND MESSAGE ==================== */
    const handleSendMessage = useCallback(async () => {
        if (!text.trim() || !currentUserUid) return;

        const messageText: string = text;
        setText('');
        prevTextRef.current = '';

        // Handle Meta AI chat - call backend API
        if (isMetaAIChat) {
            // Optimistically add user message to UI immediately
            const tempUserMessage = {
                id: `temp_${Date.now()}_user`,
                text: messageText,
                senderId: currentUserUid,
                createdAt: firestore.Timestamp.now(),
                seen: true,
                delivered: true,
                seenBy: [currentUserUid],
            };
            setMessages([...messages, tempUserMessage]);

            // Call backend API - backend will save both user message and AI response to Firestore
            try {
                console.log('[ChatScreen] Calling Meta AI backend API...');
                await sendMessageToMetaAI(currentUserUid, messageText);
                console.log('[ChatScreen] ✅ Message sent to backend, waiting for Firestore update...');
                
                // Firestore listener will automatically update with both user message and AI response
                // No need to add optimistic AI message - it will come from Firestore
                
            } catch (error: any) {
                console.error('[ChatScreen] ❌ Error getting AI response:', error);
                
                // Remove the optimistic user message on error
                setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));
                
                // Show error to user
                Alert.alert(
                    'Error',
                    error.message?.includes('Failed to fetch') || error.message?.includes('Network')
                        ? 'Cannot connect to server. Please check your connection and ensure the backend is running on port 5000.'
                        : 'Failed to get AI response. Please try again.',
                    [{ text: 'OK' }]
                );
            }

            return;
        }

        // Normal chat flow (Firestore)
        const chatRoomRef = firestore()
            .collection('chatRooms')
            .doc(chatId);

        const messagesRef = chatRoomRef.collection('messages');

        const chatRoomSnap = await chatRoomRef.get();
        const chatRoomData = chatRoomSnap.data();

        if (!chatRoomData) return;

        const participants: string[] = chatRoomData.participants || [];
        const selfChat = participants.length === 1 && participants[0] === currentUserUid;
        
        const receiverUid =
            participants.find(uid => uid !== currentUserUid) ||
            currentUserUid;
        
        const messageRef = await messagesRef.add({
            text: messageText,
            senderId: currentUserUid,
            createdAt: firestore.FieldValue.serverTimestamp(),
            seen: false,
            delivered: !selfChat,
            seenBy: [], // Array of user UIDs who have seen this message
        });

        // For self-chat: mark as delivered immediately, then as seen after 1 second
        if (selfChat) {
            await messageRef.update({
                delivered: true,
            });
            
            setTimeout(async () => {
                try {
                    const messageData = (await messageRef.get()).data();
                    const currentSeenBy = messageData?.seenBy || [];
                    if (!currentSeenBy.includes(currentUserUid)) {
                        currentSeenBy.push(currentUserUid);
                    }
                    await messageRef.update({
                        seen: true,
                        seenAt: firestore.FieldValue.serverTimestamp(),
                        seenBy: currentSeenBy,
                    });
                } catch (error) {
                    console.log('[ChatScreen] Error marking self-message as seen:', error);
                }
            }, 1000);
        }

        // Update chat room document with lastMessage object
        const updateData: any = {
            lastMessage: {
                text: messageText,
                senderId: currentUserUid,
                timestamp: firestore.FieldValue.serverTimestamp(),
                seenBy: [], // Will be updated when other user sees it
            },
            lastMessageAt: firestore.FieldValue.serverTimestamp(),
            lastMessageSenderId: currentUserUid,
            lastMessageTime: firestore.FieldValue.serverTimestamp(), // Keep for backward compatibility
            updatedAt: firestore.FieldValue.serverTimestamp(),
        };

        if (!selfChat) {
            updateData[`unreadCount.${receiverUid}`] = firestore.FieldValue.increment(1);
        } else {
            updateData[`unreadCount.${currentUserUid}`] = 0;
        }

        await chatRoomRef.update(updateData);
    }, [text, chatId, currentUserUid, isMetaAIChat, messages]);

    /* ==================== DELETE CHAT ==================== */
    const handleDeleteChatConfirm = useCallback(() => {
        Alert.alert(
            'Delete chat?',
            'This will delete all messages.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (isMetaAIChat) {
                                // For Meta AI: delete from Firestore (backend creates chat rooms)
                                const metaAIChatRoomId = `meta_ai_chat_${currentUserUid}`;
                                const chatRoomRef = firestore()
                                    .collection('chatRooms')
                                    .doc(metaAIChatRoomId);

                                // Check if chat room exists
                                const chatRoomDoc = await chatRoomRef.get();
                                
                                if (chatRoomDoc.exists) {
                                    // Get all messages first
                                    const messagesSnapshot = await chatRoomRef
                                        .collection('messages')
                                        .get();

                                    // Delete all messages in batches
                                    const batches: any[] = [];
                                    let currentBatch = firestore().batch();
                                    let batchCount = 0;
                                    const maxBatchSize = 500;

                                    messagesSnapshot.docs.forEach((doc) => {
                                        if (batchCount >= maxBatchSize) {
                                            batches.push(currentBatch);
                                            currentBatch = firestore().batch();
                                            batchCount = 0;
                                        }
                                        currentBatch.delete(doc.ref);
                                        batchCount++;
                                    });

                                    // Add the last batch if it has operations
                                    if (batchCount > 0) {
                                        batches.push(currentBatch);
                                    }

                                    // Commit all batches sequentially
                                    for (const batch of batches) {
                                        await batch.commit();
                                    }

                                    // Delete the chat room document
                                    await chatRoomRef.delete();
                                    console.log('[ChatScreen] ✅ Meta AI chat room and messages deleted from Firestore');

                                    // Also clear any locally stored Meta AI messages
                                    if (currentUserUid) {
                                        await AsyncStorage.removeItem(`meta_ai_messages_${currentUserUid}`);
                                        console.log('[ChatScreen] ✅ Meta AI messages removed from AsyncStorage after Firestore delete');
                                    }
                                } else {
                                    // Fallback: delete from AsyncStorage if no Firestore room exists
                                    if (currentUserUid) {
                                        await AsyncStorage.removeItem(`meta_ai_messages_${currentUserUid}`);
                                        console.log('[ChatScreen] ✅ Meta AI messages deleted from AsyncStorage (no Firestore room found)');
                                    }
                                }
                                
                                // Navigate back
                                navigation.goBack();
                                return;
                            }

                            // For normal chats: delete from Firestore
                            const chatRoomRef = firestore()
                                .collection('chatRooms')
                                .doc(chatId);

                            // Get all messages first
                            const messagesSnapshot = await chatRoomRef
                                .collection('messages')
                                .get();

                            // Delete all messages in batches (Firestore batch limit is 500)
                            const batches: any[] = [];
                            let currentBatch = firestore().batch();
                            let batchCount = 0;
                            const maxBatchSize = 500;

                            messagesSnapshot.docs.forEach((doc) => {
                                if (batchCount >= maxBatchSize) {
                                    batches.push(currentBatch);
                                    currentBatch = firestore().batch();
                                    batchCount = 0;
                                }
                                currentBatch.delete(doc.ref);
                                batchCount++;
                            });

                            // Add the last batch if it has operations
                            if (batchCount > 0) {
                                batches.push(currentBatch);
                            }

                            // Commit all batches sequentially to avoid conflicts
                            for (const batch of batches) {
                                await batch.commit();
                            }

                            // Delete the chat room document
                            await chatRoomRef.delete();

                            console.log('[ChatScreen] ✅ Chat room and messages deleted successfully');

                            // Navigate back to home
                            navigation.goBack();
                        } catch (error: any) {
                            console.error('[ChatScreen] Error deleting chat:', error);
                            Alert.alert(
                                'Error',
                                'Failed to delete chat. Please try again.',
                                [{ text: 'OK' }]
                            );
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    }, [chatId, isMetaAIChat, currentUserUid, navigation]);

    const handleMenuPress = useCallback(() => {
        setMenuVisible(true);
    }, []);

    const handleMenuClose = useCallback(() => {
        setMenuVisible(false);
    }, []);

    // Using formatMessageTime from dateUtils - shows only time (hh:mm AM/PM)

    /* ==================== RENDER MESSAGE ==================== */
    const renderMessage = ({ item, index }: any) => {
        const isMe = item.senderId === currentUserUid;
        // Use formatMessageTime - shows only time (hh:mm AM/PM), no date
        const timeStr = formatMessageTime(item.createdAt);
        
        // Check if we need to show a date separator
        // Show separator if this is the first message OR if the day is different from previous message
        const showDateSeparator = (() => {
            if (index === 0) {
                // Always show separator for first message
                return true;
            }
            
            const prevMessage = messages[index - 1];
            if (!prevMessage || !prevMessage.createdAt || !item.createdAt) {
                return false;
            }
            
            // Convert timestamps to Date objects
            const prevDate = timestampToDate(prevMessage.createdAt);
            const currentDate = timestampToDate(item.createdAt);
            
            if (!prevDate || !currentDate) {
                return false;
            }
            
            // Check if dates are on different calendar days
            return !isSameDay(prevDate, currentDate);
        })();
        
        // Get date separator label if needed
        const dateSeparatorLabel = showDateSeparator 
            ? formatDateSeparator(timestampToDate(item.createdAt) || new Date())
            : null;

        return (
            <View>
                {showDateSeparator && dateSeparatorLabel && (
                    <DateSeparator label={dateSeparatorLabel} />
                )}
                <View
                    style={[
                        chatScreenStyles.messageRow,
                        isMe ? chatScreenStyles.messageRowMe : chatScreenStyles.messageRowOther,
                    ]}
                >
                    <View
                        style={[
                            chatScreenStyles.messageBubble,
                            isMe ? chatScreenStyles.myMessage : chatScreenStyles.otherMessage,
                        ]}
                    >
                        <Text style={chatScreenStyles.messageText}>
                            {item.text}
                        </Text>
                        
                        {/* Timestamp and ticks inside bubble */}
                        <View style={chatScreenStyles.messageFooter}>
                            <Text style={chatScreenStyles.messageTime}>
                                {timeStr}
                            </Text>
                            {isMe && (() => {
                                // Get other user UID to check if they've seen the message
                                // Use participants state (defined above)
                                const participantsList = participants.length > 0 ? participants : [];
                                const otherUserUid = participantsList.length > 0 
                                    ? participantsList.find((uid: string) => uid !== currentUserUid) || currentUserUid
                                    : currentUserUid;
                                const seenBy = item.seenBy || [];
                                
                                // For self-chat: check if current user has seen their own message
                                // For normal chat: check if other user has seen the message
                                const isSeen = isSelfChat 
                                    ? seenBy.includes(currentUserUid)
                                    : seenBy.includes(otherUserUid);
                                
                                // Delivered status: check item.delivered (if seen, it's automatically delivered, but we check delivered first)
                                const isDelivered = item.delivered === true;
                                
                                // Tick display logic:
                                // - Single tick (✔) gray = sent but not delivered
                                // - Double tick (✔✔) gray = delivered but not seen
                                // - Double tick (✔✔) blue = seen
                                
                                return (
                                    <Text
                                        style={[
                                            chatScreenStyles.tickText,
                                            isSeen ? chatScreenStyles.tickSeen : (isDelivered ? chatScreenStyles.tickDelivered : chatScreenStyles.tickSent),
                                        ]}
                                    >
                                        {isSeen ? '✔✔' : (isDelivered ? '✔✔' : '✔')}
                                    </Text>
                                );
                            })()}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    /* ==================== UI ==================== */
    return (
        <SafeAreaView style={chatScreenStyles.container}>
            {/* Header */}
            <View style={chatScreenStyles.header}>
                <TouchableOpacity
                    style={chatScreenStyles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={chatScreenStyles.backIcon}>←</Text>
                </TouchableOpacity>
                
                <View style={chatScreenStyles.avatarContainer}>
                    {isMetaAIChat ? (
                        <MetaAIAvatar size={40} />
                    ) : (
                        <View style={chatScreenStyles.avatar}>
                            <Text style={chatScreenStyles.avatarText}>
                                {isSelfChat ? 'M' : (chatName?.charAt(0) || '?')}
                            </Text>
                        </View>
                    )}
                </View>
                
                <TouchableOpacity
                    style={chatScreenStyles.headerInfo}
                    onPress={() => {
                        if (!isMetaAIChat && !isSelfChat && otherUserUid) {
                            navigation.navigate('ContactProfile', {
                                userId: otherUserUid,
                                userName: chatName || 'Unknown',
                                phoneNumber: otherUserPhone || undefined,
                            });
                        }
                    }}
                    disabled={isMetaAIChat || isSelfChat || !otherUserUid}
                    activeOpacity={isMetaAIChat || isSelfChat || !otherUserUid ? 1 : 0.7}
                >
                    {isMetaAIChat ? (
                        <>
                            <Text style={chatScreenStyles.headerTitle} numberOfLines={1}>
                                Meta AI
                            </Text>
                            <Text style={chatScreenStyles.headerSubtitle} numberOfLines={1}>
                                with Llama 4
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text style={chatScreenStyles.headerTitle} numberOfLines={1}>
                                {isSelfChat ? 'My Number (You)' : (chatName || otherUserPhone || 'Unknown')}
                            </Text>
                            {!isSelfChat && otherUserPhone && chatName !== otherUserPhone && (
                                <Text style={chatScreenStyles.headerSubtitle} numberOfLines={1}>
                                    {otherUserPhone}
                                </Text>
                            )}
                            {isSelfChat && (
                                <Text style={chatScreenStyles.headerSubtitle} numberOfLines={1}>
                                    Message yourself
                                </Text>
                            )}
                        </>
                    )}
                </TouchableOpacity>
                
                <View style={chatScreenStyles.headerActions}>
                    {isMetaAIChat ? (
                        <TouchableOpacity 
                            style={chatScreenStyles.menuButton}
                            onPress={handleMenuPress}
                        >
                            <Text style={chatScreenStyles.menuIcon}>⋮</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity style={chatScreenStyles.headerActionButton}>
                                <Text style={chatScreenStyles.headerActionIcon}>📹</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={chatScreenStyles.headerActionButton}>
                                <Text style={chatScreenStyles.headerActionIcon}>📞</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={chatScreenStyles.menuButton}
                                onPress={handleMenuPress}
                            >
                                <Text style={chatScreenStyles.menuIcon}>⋮</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            {/* Encryption Banner - At Top (hide for Meta AI) */}
            {!isMetaAIChat && (
                <View style={chatScreenStyles.encryptionBanner}>
                    <Text style={chatScreenStyles.encryptionIcon}>🔒</Text>
                    <Text style={chatScreenStyles.encryptionText}>
                        Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them. Learn more.
                    </Text>
                </View>
            )}

            {/* Messages with Background */}
            <ImageBackground
                source={require('../../../assets/images/Wchat-background.jpg')}
                style={chatScreenStyles.backgroundImage}
                imageStyle={{ opacity: 0.4 }}
                resizeMode="cover"
            >
                {isMetaAIChat && messages.length === 0 ? (
                    // First-time Meta AI screen
                    <MetaAIFirstTimeScreen
                        userName={userName || 'User'}
                        onSuggestionPress={(suggestion) => {
                            setText(suggestion);
                        }}
                    />
                ) : (
                    <FlatList
                        data={messages}
                        keyExtractor={item => item.id}
                        renderItem={renderMessage}
                        contentContainerStyle={chatScreenStyles.messageList}
                        inverted={false}
                        ListHeaderComponent={
                            isMetaAIChat && messages.length > 0 ? (
                                <View style={{ paddingVertical: spacing.sm }}>
                                    <View style={chatScreenStyles.systemMessage}>
                                        <Text style={chatScreenStyles.systemMessageText}>
                                            Messages are generated by AI. Some may be inaccurate or inappropriate. Learn more.
                                        </Text>
                                    </View>
                                </View>
                            ) : null
                        }
                    />
                )}
            </ImageBackground>

            {/* Input Bar */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={chatScreenStyles.inputContainer}>
                    <TouchableOpacity style={chatScreenStyles.emojiButton}>
                        <Text style={chatScreenStyles.emojiIcon}>😊</Text>
                    </TouchableOpacity>
                    
                    <View style={chatScreenStyles.inputWrapper}>
                        <TextInput
                            style={chatScreenStyles.input}
                            placeholder="Message"
                            placeholderTextColor={colors.textTertiary}
                            value={text}
                            onChangeText={(newText) => {
                                const prevText = prevTextRef.current;
                                
                                // Check if Enter was pressed (newline added at the end)
                                // If newText ends with '\n' and prevText didn't, and prevText is not empty,
                                // it means Enter was pressed to send (not Shift+Enter for newline)
                                if (newText.endsWith('\n') && !prevText.endsWith('\n') && prevText.trim()) {
                                    // Enter pressed without Shift - send message
                                    setText(prevText.trim()); // Use previous text (without newline)
                                    prevTextRef.current = prevText.trim();
                                    handleSendMessage();
                                } else {
                                    // Normal typing or Shift+Enter (newline in middle/end)
                                    setText(newText);
                                    prevTextRef.current = newText;
                                }
                            }}
                            multiline
                            blurOnSubmit={false}
                            onSubmitEditing={() => {
                                // Fallback: send message when submit button is pressed
                                if (text.trim()) {
                                    handleSendMessage();
                                }
                            }}
                        />
                    </View>
                    
                    {text.trim() ? (
                        <TouchableOpacity
                            style={chatScreenStyles.sendButton}
                            onPress={handleSendMessage}
                        >
                            <Text style={chatScreenStyles.sendIcon}>➤</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity style={chatScreenStyles.attachButton}>
                                <Text style={chatScreenStyles.attachIcon}>📎</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={chatScreenStyles.cameraButton}>
                                <Text style={chatScreenStyles.cameraIcon}>📷</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={chatScreenStyles.micButton}>
                                <Text style={chatScreenStyles.micIcon}>🎤</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </KeyboardAvoidingView>

            {/* Chat Menu */}
            <ChatMenu
                visible={menuVisible}
                onClose={handleMenuClose}
                onDeleteChat={handleDeleteChatConfirm}
            />
        </SafeAreaView>
    );
};
