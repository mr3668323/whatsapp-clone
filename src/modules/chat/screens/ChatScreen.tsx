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
    Image,
    Keyboard,
    Linking,
    PermissionsAndroid,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

import { chatScreenStyles } from '../styles/ChatScreen.styles';
import { useTheme } from '../../../contexts/ThemeContext';
import { spacing } from '../../../styles/spacing';
import { DateSeparator } from '../../../components/chat/DateSeparator';
import { formatMessageTime, formatDateSeparator, timestampToDate, isSameDay } from '../../../utils/dateUtils';
import { MetaAIAvatar } from '../../../components/chat/MetaAIAvatar';
import { MetaAIFirstTimeScreen } from '../../../components/chat/MetaAIFirstTimeScreen';
import { ChatMenu } from '../../../components/chat/ChatMenu';
import { sendMessageToMetaAI } from '../../../services/metaAIService';
import { getUserData } from '../../../services/userService';
import { getChatRoomId } from '../../../utils/chatRoomId';
import { pickImageOrVideo, pickDocument, openCamera } from '../../../utils/mediaPicker';
import { uploadMedia } from '../../../services/cloudinaryService';
import { CLOUDINARY_CONFIG } from '../../../config/cloudinary';
import { API_BASE_URL } from '../../../config/api';
import RNFS from 'react-native-fs';

type RouteParams = {
    chatId: string;
    chatName: string;
};

const ChatScreen: React.FC = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { theme, isDark } = useTheme();
    
    // Use styles (should always be defined)
    const styles = chatScreenStyles || {};
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

    const [messages, setMessages] = useState<any[] | null>(null);
    const [hasInitialSnapshot, setHasInitialSnapshot] = useState(false);
    const [text, setText] = useState('');
    const prevTextRef = useRef('');
    const [isMetaAITyping, setIsMetaAITyping] = useState(false);
    const lastMetaAISendAtRef = useRef<number | null>(null);
    // Store participants for tick logic
    const [participants, setParticipants] = useState<string[]>([]);
    // User name for Meta AI greeting
    const [userName, setUserName] = useState<string>('');
    // Menu visibility
    const [menuVisible, setMenuVisible] = useState(false);
    // Input + keyboard visibility toggle
    const inputRef = useRef<TextInput | null>(null);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    // Pending media (file selected but not yet sent)
    const [pendingMedia, setPendingMedia] = useState<{
        file: any;
        mediaType: 'image' | 'video' | 'audio' | 'file';
    } | null>(null);
    // Voice recording state
    const [isRecording, setIsRecording] = useState(false);
    const [recordSecs, setRecordSecs] = useState(0); // Recording duration in seconds
    const [isSlidingToCancel, setIsSlidingToCancel] = useState(false); // Track slide-to-cancel gesture
    const audioRecorderPlayer = useRef<any>(null);
    const recordingPathRef = useRef<string | null>(null);
    const recordingStartedRef = useRef<boolean>(false); // Track if recording actually started successfully
    const recordTimerRef = useRef<NodeJS.Timeout | null>(null); // Timer for recording duration
    const micButtonRef = useRef<TouchableOpacity | null>(null);
    // Voice playback state
    const [currentlyPlayingMessageId, setCurrentlyPlayingMessageId] = useState<string | null>(null);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [playbackSecs, setPlaybackSecs] = useState(0);
    // Track extracted durations for messages (UI-only, not in Firestore)
    const messageDurationsRef = useRef<Record<string, number>>({});
    // State to trigger re-render when durations are extracted
    const [extractedDurations, setExtractedDurations] = useState<Record<string, number>>({});
    // Message selection state
    const [selectedMessageIds, setSelectedMessageIds] = useState<Set<string>>(new Set());
    
    // Lazy load audio recorder player (only if package is installed)
    useEffect(() => {
        let isMounted = true;
        
        const initRecorder = async () => {
            try {
                // Dynamic import to avoid crash if package is not installed
                const AudioRecorderPlayerModule = require('react-native-audio-recorder-player').default;
                if (isMounted) {
                    audioRecorderPlayer.current = new AudioRecorderPlayerModule();
                    console.log('[ChatScreen] ✅ Audio recorder initialized');
                }
            } catch (error: any) {
                console.warn('[ChatScreen] ⚠️ react-native-audio-recorder-player not installed. Voice recording disabled.', error?.message);
                if (isMounted) {
                    audioRecorderPlayer.current = null;
                }
            }
        };

        initRecorder();

        // Cleanup: stop timer, recording, and playback on unmount
        return () => {
            isMounted = false;
            
            // Stop timer
            if (recordTimerRef.current) {
                clearInterval(recordTimerRef.current);
                recordTimerRef.current = null;
            }
            
            if (audioRecorderPlayer.current) {
                // Stop recording if active
                if (recordingStartedRef.current) {
                    audioRecorderPlayer.current.stopRecorder().catch(() => {});
                    recordingStartedRef.current = false;
                }

                // Stop playback if active
                audioRecorderPlayer.current.stopPlayer?.().catch?.(() => {});
                audioRecorderPlayer.current.removePlayBackListener?.();
            }
        };
    }, []);

    // Removed manual scroll management – inverted FlatList + maintainVisibleContentPosition
    // will handle WhatsApp-like behavior (pinned to bottom when at bottom, no jump when scrolled up).

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
                        if (!hasInitialSnapshot) {
                            setHasInitialSnapshot(true);
                        }
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
                            
                            // CRITICAL FIX: For Meta AI user messages, always mark as delivered
                            // Meta AI is a system chat - user messages are always "delivered" when saved to Firestore
                            // This prevents tick downgrade (backend saves with seenBy: [], but we override for Meta AI)
                            const processedMsgs = finalMsgs.map((msg: any) => {
                                // For Meta AI user messages: always mark as delivered
                                // Meta AI is not a real user, so "delivered" means message was saved to system
                                if (msg.senderId === currentUserUid && msg.senderId !== 'meta_ai') {
                                    return {
                                        ...msg,
                                        delivered: true, // Always delivered for Meta AI (system chat)
                                        seen: true, // Meta AI is system, user message is always "seen"
                                        seenBy: [currentUserUid], // User has "seen" their own message in system
                                    };
                                }
                                return msg;
                            });
                            
                            console.log('[ChatScreen] Meta AI messages loaded from Firestore:', processedMsgs.length, '(deduplicated from', msgs.length, ')');

                            setMessages(processedMsgs);

                            // If we were showing a typing indicator for the latest user message,
                            // turn it off once we see an AI reply created after the last send time.
                            if (lastMetaAISendAtRef.current != null) {
                                const hasNewAIReply = processedMsgs.some((msg: any) => {
                                    if (msg.senderId !== 'meta_ai' || !msg.createdAt) return false;
                                    const msgTime = timestampToDate(msg.createdAt)?.getTime() ?? 0;
                                    return msgTime >= lastMetaAISendAtRef.current!;
                                });
                                if (hasNewAIReply) {
                                    setIsMetaAITyping(false);
                                    lastMetaAISendAtRef.current = null;
                                }
                            }
                            
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
                                        // Don't update lastMessageCountRef here - let the effect handle it
                                        setMessages(messagesWithTimestamps);
                                        if (!hasInitialSnapshot) {
                                            setHasInitialSnapshot(true);
                                        }
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
                                    // Don't update lastMessageCountRef here - let the effect handle it
                                    setMessages(messagesWithTimestamps);
                                    if (!hasInitialSnapshot) {
                                        setHasInitialSnapshot(true);
                                    }
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
                if (!hasInitialSnapshot) {
                    setHasInitialSnapshot(true);
                }
            }, error => {
                console.error('[ChatScreen] Error loading messages:', error);
                if (!hasInitialSnapshot) {
                    setHasInitialSnapshot(true);
                }
            });

        return () => unsubscribe();
    }, [chatId, isMetaAIChat, currentUserUid, hasInitialSnapshot]);

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

    /* ==================== EXTRACT DURATION FOR AUDIO MESSAGES ON LOAD ==================== */
    // Extract duration for all audio messages when they're first loaded
    // This ensures duration is displayed immediately, not just after playback starts
    useEffect(() => {
        if (!messages || messages.length === 0) {
            return;
        }

        // Wait for audioRecorderPlayer to be initialized
        if (!audioRecorderPlayer.current) {
            // Retry after a short delay if audioRecorderPlayer is not ready
            const timeout = setTimeout(() => {
                if (audioRecorderPlayer.current) {
                    extractDurationsForMessages();
                }
            }, 500);
            return () => clearTimeout(timeout);
        }

        const extractDurationsForMessages = async () => {
            if (!audioRecorderPlayer.current) {
                return;
            }

            const durationsToExtract: Array<{ id: string; mediaUrl: string }> = [];

            // Collect all audio messages that need duration extraction
            for (const message of messages) {
                // Only process audio messages
                if (message.messageType !== 'media' || message.mediaType !== 'audio' || !message.mediaUrl) {
                    continue;
                }

                // Skip if duration already exists in Firestore
                if (message.duration || message.durationSecs) {
                    continue;
                }

                // Skip if we already extracted duration for this message
                if (messageDurationsRef.current[message.id] || extractedDurations[message.id]) {
                    continue;
                }

                durationsToExtract.push({ id: message.id, mediaUrl: message.mediaUrl });
            }

            // Extract durations for all messages in parallel (non-blocking)
            const extractionPromises = durationsToExtract.map(async ({ id, mediaUrl }) => {
                try {
                    // Try to get duration from remote URL (Cloudinary)
                    // Note: getDuration may not work with remote URLs on all platforms
                    // If it fails, duration will be extracted during playback
                    const durationMs = await audioRecorderPlayer.current.getDuration?.(mediaUrl).catch(() => null);
                    if (durationMs && durationMs > 0) {
                        const totalSecs = Math.floor(durationMs / 1000);
                        if (totalSecs > 0) {
                            messageDurationsRef.current[id] = totalSecs;
                            // Update state to trigger re-render and show duration immediately
                            setExtractedDurations(prev => ({
                                ...prev,
                                [id]: totalSecs,
                            }));
                            console.log('[ChatScreen] ✅ Extracted duration for message', id, ':', totalSecs, 'seconds');
                            return;
                        }
                    }
                    // If getDuration doesn't work, log for debugging
                    console.log('[ChatScreen] ⚠️ getDuration returned null/0 for message', id, '- will extract during playback');
                } catch (error) {
                    // Ignore errors - duration extraction is non-blocking
                    console.warn('[ChatScreen] ⚠️ Could not extract duration for message', id, ':', error);
                }
            });

            // Wait for all extractions to complete (non-blocking)
            await Promise.all(extractionPromises);
        };

        extractDurationsForMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]); // Only depend on messages, not extractedDurations (to avoid infinite loop)

    /* ==================== SEND MEDIA MESSAGE ==================== */
    const sendMediaMessage = useCallback(
        async (file: any, mediaType: 'image' | 'video' | 'audio' | 'file', durationSecs?: number) => {
            if (!currentUserUid || !chatId || !file) {
                return;
            }

            try {
                const mediaUrl = await uploadMedia(file, mediaType);

                const chatRoomRef = firestore()
                    .collection('chatRooms')
                    .doc(chatId);

                // Add message to messages collection
                const messageData: any = {
                    messageType: 'media',
                    text: '',
                    mediaUrl,
                    mediaType,
                    senderId: currentUserUid,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    seenBy: [],
                };
                
                // STEP 2: Store duration in Firestore (MANDATORY for audio messages)
                // Field name: 'duration' (in seconds) - single source of truth
                if (mediaType === 'audio' && durationSecs !== undefined && durationSecs > 0) {
                    messageData.duration = durationSecs; // Store as 'duration' in seconds
                    // Also keep durationSecs for backward compatibility
                    messageData.durationSecs = durationSecs;
                }
                
                await chatRoomRef
                    .collection('messages')
                    .add(messageData);

                // Update chat room document with lastMessage (CRITICAL for HomeScreen preview)
                // For voice messages, format: "🎤 Voice message (0:01)"
                let lastMessageText = '';
                if (mediaType === 'audio' && durationSecs !== undefined && durationSecs > 0) {
                    // Format duration: 0:SS or M:SS
                    const minutes = Math.floor(durationSecs / 60);
                    const seconds = durationSecs % 60;
                    const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                    lastMessageText = `🎤 Voice message (${durationStr})`;
                } else if (mediaType === 'image') {
                    lastMessageText = '📷 Photo';
                } else if (mediaType === 'video') {
                    lastMessageText = '🎥 Video';
                } else {
                    lastMessageText = '📎 File';
                }

                // Update chat room document with lastMessage (CRITICAL for HomeScreen preview)
                // Use batch to ensure atomic update
                const batch = firestore().batch();
                batch.update(chatRoomRef, {
                    lastMessage: {
                        text: lastMessageText,
                        senderId: currentUserUid,
                        timestamp: firestore.FieldValue.serverTimestamp(),
                        seenBy: [],
                        mediaType: mediaType, // Include mediaType for HomeScreen to detect voice messages
                    },
                    lastMessageAt: firestore.FieldValue.serverTimestamp(),
                    lastMessageSenderId: currentUserUid,
                    lastMessageTime: firestore.FieldValue.serverTimestamp(),
                    updatedAt: firestore.FieldValue.serverTimestamp(),
                });
                await batch.commit();
                
                console.log('[ChatScreen] ✅ Chat room lastMessage updated:', lastMessageText);
            } catch (error) {
                console.log('[ChatScreen] Error sending media message:', error);
                Alert.alert('Error', 'Failed to send media. Please try again.');
            }
        },
        [chatId, currentUserUid],
    );

    /* ==================== SEND MESSAGE ==================== */
    const handleSendMessage = useCallback(async () => {
        // Allow sending if there's text OR pending media
        if ((!text.trim() && !pendingMedia) || !currentUserUid) return;

        const messageText: string = text.trim();
        const mediaToSend = pendingMedia;
        
        // Clear pending media immediately (optimistic UI)
        setPendingMedia(null);
        setText('');
        prevTextRef.current = '';

        // If there's pending media, send it first
        if (mediaToSend) {
            try {
                await sendMediaMessage(mediaToSend.file, mediaToSend.mediaType);
            } catch (error) {
                console.log('[ChatScreen] Error sending media message:', error);
                // Media send failed - could restore pendingMedia here if needed
            }
        }

        // If there's text, send it as a separate message (or combine with media if needed)
        if (!messageText) {
            // Only media was sent, no text message needed
            return;
        }

        // Handle Meta AI chat - call backend API (with optimistic UI)
        if (isMetaAIChat) {
            const now = new Date();

            // Optimistic user message so UI feels instant
            const tempUserMessage: any = {
                id: `temp_user_${now.getTime()}`,
                text: messageText,
                senderId: currentUserUid,
                createdAt: firestore.Timestamp.fromDate(now),
                delivered: false,
                seen: false,
                seenBy: [],
                isTemp: true,
            };

            setMessages(prev => {
                const base = prev ?? [];
                return [...base, tempUserMessage];
            });

            // Start Meta AI typing indicator immediately
            setIsMetaAITyping(true);
            lastMetaAISendAtRef.current = now.getTime();
            
            // Call backend API - backend will save both user message and AI response to Firestore
            try {
                console.log('[ChatScreen] Calling Meta AI backend API...');
                await sendMessageToMetaAI(currentUserUid, messageText);
                console.log('[ChatScreen] ✅ Message sent to backend, waiting for Firestore update...');
            } catch (error: any) {
                console.error('[ChatScreen] ❌ Error getting AI response:', error);
                // Remove optimistic message and typing indicator on error
                setMessages(prev => {
                    if (!prev) return prev;
                    return prev.filter(m => !m.isTemp);
                });
                setIsMetaAITyping(false);
                lastMetaAISendAtRef.current = null;
                
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
            messageType: 'text',
            text: messageText,
            mediaUrl: null,
            mediaType: null,
            senderId: currentUserUid,
            createdAt: firestore.FieldValue.serverTimestamp(),
            seen: false,
            delivered: !selfChat,
            seenBy: [],
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
        // Inverted FlatList will keep view pinned to bottom when user is already there
        // so no manual scroll is needed here.
    }, [text, pendingMedia, chatId, currentUserUid, isMetaAIChat, messages, sendMediaMessage]);

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
                                
                                if (chatRoomDoc.exists()) {
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

    /* ==================== MEDIA PICKER HANDLERS ==================== */
    const handleAttachDocument = useCallback(async () => {
        const file = await pickDocument();
        if (!file) return;

        const rawType: string = (file as any).type || (file as any).mimeType || '';
        const isAudio = rawType.startsWith('audio/');
        const mediaType: 'audio' | 'file' = isAudio ? 'audio' : 'file';

        // Store in pending state instead of sending immediately
        setPendingMedia({ file, mediaType });
    }, []);

    const handlePickMedia = useCallback(async () => {
        const file = await pickImageOrVideo();
        if (!file) return;

        const rawType: string = (file as any).type || '';
        const isVideo = rawType.startsWith('video/');
        const mediaType: 'image' | 'video' = isVideo ? 'video' : 'image';

        // Store in pending state instead of sending immediately
        setPendingMedia({ file, mediaType });
    }, []);

    const handleOpenCamera = useCallback(async () => {
        const file = await openCamera();
        if (!file) return;

        const rawType: string = (file as any).type || '';
        const isVideo = rawType.startsWith('video/');
        const mediaType: 'image' | 'video' = isVideo ? 'video' : 'image';

        // Store in pending state instead of sending immediately
        setPendingMedia({ file, mediaType });
    }, []);

    /* ==================== VOICE RECORDING HANDLERS ==================== */
    const requestAudioPermission = useCallback(async (): Promise<boolean> => {
        if (Platform.OS === 'android') {
            try {
                // Request RECORD_AUDIO permission (required for all Android versions)
                const recordAudioGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        title: 'Microphone Permission',
                        message: 'WhatsApp needs access to your microphone to record voice messages.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                if (recordAudioGranted !== PermissionsAndroid.RESULTS.GRANTED) {
                    return false;
                }

                // Android 13+ (API 33+): Request READ_MEDIA_AUDIO for accessing audio files
                if (Platform.Version >= 33) {
                    try {
                        const readMediaAudioGranted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
                            {
                                title: 'Audio Access Permission',
                                message: 'WhatsApp needs access to audio files to send voice messages.',
                                buttonNeutral: 'Ask Me Later',
                                buttonNegative: 'Cancel',
                                buttonPositive: 'OK',
                            }
                        );
                        // READ_MEDIA_AUDIO is optional for recording, but required for accessing files
                        // Continue even if denied - recording will still work
                        if (readMediaAudioGranted !== PermissionsAndroid.RESULTS.GRANTED) {
                            console.warn('[ChatScreen] READ_MEDIA_AUDIO permission denied - recording will still work');
                        }
                    } catch (mediaError) {
                        // Permission might not be available on older devices - ignore
                        console.warn('[ChatScreen] READ_MEDIA_AUDIO permission not available:', mediaError);
                    }
                }

                // Android < 10 (API < 29): Request WRITE_EXTERNAL_STORAGE for legacy storage
                if (Platform.Version < 29) {
                    const writeStorageGranted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        {
                            title: 'Storage Permission',
                            message: 'WhatsApp needs access to storage to save voice messages.',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        }
                    );
                    
                    return writeStorageGranted === PermissionsAndroid.RESULTS.GRANTED;
                }

                // Android 10-12: RECORD_AUDIO is sufficient (scoped storage handles the rest)
                return true;
            } catch (err) {
                console.warn('[ChatScreen] Error requesting audio permission:', err);
                return false;
            }
        }
        // iOS permissions are handled via Info.plist - system will prompt automatically
        return true;
    }, []);

    const handleStartRecording = useCallback(async () => {
        // Prevent starting if already recording
        if (isRecording || recordingStartedRef.current || !currentUserUid) {
            console.warn('[ChatScreen] Cannot start recording: already recording or invalid state');
            return;
        }

        // Check if audio recorder is available
        if (!audioRecorderPlayer.current) {
            Alert.alert(
                'Voice Recording Unavailable',
                'Please install react-native-audio-recorder-player to enable voice messages.\n\nRun: npm install react-native-audio-recorder-player'
            );
            return;
        }

        // Request permission first - abort if not granted
        const hasPermission = await requestAudioPermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Microphone permission is required to record voice messages.');
            return;
        }

        // Ensure any previous recording is stopped
        try {
            if (audioRecorderPlayer.current && recordingPathRef.current) {
                await audioRecorderPlayer.current.stopRecorder().catch(() => {});
            }
        } catch (e) {
            // Ignore errors when stopping non-existent recorder
        }

        // Reset state before starting
        recordingStartedRef.current = false;
        recordingPathRef.current = null;
        setRecordSecs(0);

        try {
            // Generate absolute file path for audio recording (REQUIRED for Android 10+ scoped storage)
            // Android 10+ requires absolute paths to app-scoped directories (cache or documents)
            // Relative paths like "voice_xxx.mp4" attempt to write to read-only filesystem → EROFS error
            const timestamp = Date.now();
            let filePath: string;
            
            if (Platform.OS === 'android') {
                // Android: Use cache directory (app-scoped, writable, no permissions needed)
                const cacheDir = RNFS.CachesDirectoryPath;
                if (!cacheDir || cacheDir.trim() === '') {
                    throw new Error('Failed to get Android cache directory path');
                }
                
                // Ensure cache directory exists (safety check)
                const dirExists = await RNFS.exists(cacheDir);
                if (!dirExists) {
                    await RNFS.mkdir(cacheDir);
                }
                
                filePath = `${cacheDir}/voice_${timestamp}.mp4`;
            } else {
                // iOS: Use document directory (app-scoped, writable)
                const documentDir = RNFS.DocumentDirectoryPath;
                if (!documentDir || documentDir.trim() === '') {
                    throw new Error('Failed to get iOS document directory path');
                }
                
                // Ensure document directory exists (safety check)
                const dirExists = await RNFS.exists(documentDir);
                if (!dirExists) {
                    await RNFS.mkdir(documentDir);
                }
                
                filePath = `${documentDir}/voice_${timestamp}.m4a`;
            }

            // Ensure path is never null or empty
            if (!filePath || filePath.trim() === '') {
                throw new Error('Failed to generate audio file path');
            }

            console.log('[ChatScreen] Starting recorder with absolute path:', filePath);

            // Android-specific audio configuration
            // Using exact property names expected by react-native-audio-recorder-player
            // These values must match MediaRecorder constants exactly
            const audioSet = Platform.OS === 'android' ? {
                AudioSourceAndroid: 1, // MediaRecorder.AudioSource.MIC = 1
                OutputFormatAndroid: 2, // MediaRecorder.OutputFormat.MPEG_4 = 2
                AudioEncoderAndroid: 3, // MediaRecorder.AudioEncoder.AAC = 3
            } : {};

            // Ensure recorder is ready - remove any existing listeners
            try {
                if (audioRecorderPlayer.current) {
                    audioRecorderPlayer.current.removeRecordBackListener();
                }
            } catch (cleanupError) {
                // Ignore cleanup errors - recorder might not be initialized
            }

            // Start recorder with valid path and configuration
            // For Android: pass audioSet, for iOS: pass undefined or no second param
            const uri = Platform.OS === 'android' 
                ? await audioRecorderPlayer.current.startRecorder(filePath, audioSet)
                : await audioRecorderPlayer.current.startRecorder(filePath);
            
            // Validate that we got a valid URI back
            if (!uri || typeof uri !== 'string' || uri.trim() === '') {
                throw new Error('Invalid recording URI returned from native module');
            }

            recordingPathRef.current = uri;
            recordingStartedRef.current = true;
            setIsRecording(true);
            setRecordSecs(0);

            // Start timer for recording duration
            if (recordTimerRef.current) {
                clearInterval(recordTimerRef.current);
            }
            recordTimerRef.current = setInterval(() => {
                setRecordSecs(prev => prev + 1);
            }, 1000);

            console.log('[ChatScreen] ✅ Recording started successfully:', uri);
        } catch (error: any) {
            console.error('[ChatScreen] ❌ Error starting recording:', error);
            // Reset all recording state on error
            recordingStartedRef.current = false;
            recordingPathRef.current = null;
            setIsRecording(false);
            setRecordSecs(0);
            if (recordTimerRef.current) {
                clearInterval(recordTimerRef.current);
                recordTimerRef.current = null;
            }
            
            // Try to stop recorder if it was partially started
            try {
                if (audioRecorderPlayer.current) {
                    await audioRecorderPlayer.current.stopRecorder().catch(() => {});
                }
            } catch (e) {
                // Ignore cleanup errors
            }
            
            Alert.alert(
                'Recording Error', 
                `Failed to start recording: ${error?.message || 'Unknown error'}\n\nPlease try again.`
            );
        }
    }, [isRecording, currentUserUid, requestAudioPermission]);

    const handleCancelRecording = useCallback(async () => {
        // Cancel recording: stop recorder, delete file, don't send
        if (!recordingStartedRef.current || !recordingPathRef.current || !audioRecorderPlayer.current) {
            return;
        }

        try {
            // Stop recorder
            await audioRecorderPlayer.current.stopRecorder().catch(() => {});
            audioRecorderPlayer.current.removeRecordBackListener();

            // Delete the audio file (optional - can be cleaned up by system later)
            try {
                if (recordingPathRef.current) {
                    const exists = await RNFS.exists(recordingPathRef.current);
                    if (exists) {
                        await RNFS.unlink(recordingPathRef.current);
                    }
                }
            } catch (deleteError) {
                // Ignore delete errors - file will be cleaned up by system
            }
        } catch (error) {
            console.warn('[ChatScreen] Error canceling recording:', error);
        } finally {
            // Reset all state
            recordingStartedRef.current = false;
            setIsRecording(false);
            setIsSlidingToCancel(false);
            recordingPathRef.current = null;
            setRecordSecs(0);
            if (recordTimerRef.current) {
                clearInterval(recordTimerRef.current);
                recordTimerRef.current = null;
            }
        }
    }, []);

    const handleStopRecordingAndSend = useCallback(async (wasCancelled: boolean = false) => {
        // If cancelled, don't send
        if (wasCancelled || isSlidingToCancel) {
            await handleCancelRecording();
            return;
        }

        // Only stop if recording was actually started successfully
        if (!recordingStartedRef.current || !isRecording || !recordingPathRef.current || !audioRecorderPlayer.current) {
            // Reset state if stop was called but recording wasn't started
            recordingStartedRef.current = false;
            setIsRecording(false);
            setIsSlidingToCancel(false);
            recordingPathRef.current = null;
            setRecordSecs(0);
            if (recordTimerRef.current) {
                clearInterval(recordTimerRef.current);
                recordTimerRef.current = null;
            }
            return;
        }

        // Stop timer
        if (recordTimerRef.current) {
            clearInterval(recordTimerRef.current);
            recordTimerRef.current = null;
        }

        const currentPath = recordingPathRef.current;
        const finalRecordSecs = recordSecs;

        // Reset recording state BEFORE stopping (to prevent double-stops)
        recordingStartedRef.current = false;
        setIsRecording(false);
        setRecordSecs(0);

        try {
            console.log('[ChatScreen] Stopping recorder...');
            
            // Stop the recorder
            await audioRecorderPlayer.current.stopRecorder();
            audioRecorderPlayer.current.removeRecordBackListener();
            
            console.log('[ChatScreen] Recorder stopped, extracting duration...');
            
            // STEP 1: Extract actual audio duration from the file
            // Priority 1: Try to get duration from audio file metadata
            let actualDurationSecs = finalRecordSecs; // Fallback to timer duration
            
            try {
                if (audioRecorderPlayer.current && currentPath) {
                    // react-native-audio-recorder-player provides getDuration method
                    const durationMs = await audioRecorderPlayer.current.getDuration?.(currentPath).catch(() => null);
                    if (durationMs && durationMs > 0) {
                        actualDurationSecs = Math.floor(durationMs / 1000); // Convert ms to seconds
                        console.log('[ChatScreen] ✅ Duration extracted from file:', actualDurationSecs, 'seconds');
                    } else {
                        // Fallback to timer duration (accurate for recording)
                        console.log('[ChatScreen] Using timer duration (fallback):', finalRecordSecs, 'seconds');
                        actualDurationSecs = finalRecordSecs;
                    }
                }
            } catch (durationError) {
                // Use timer duration as final fallback
                console.warn('[ChatScreen] ⚠️ Error extracting duration, using timer:', durationError);
                actualDurationSecs = finalRecordSecs;
            }
            
            // Ensure minimum duration of 1 second (recording must be at least 1 second)
            if (actualDurationSecs < 1) {
                actualDurationSecs = 1;
            }
            
            console.log('[ChatScreen] ✅ Final audio duration:', actualDurationSecs, 'seconds');
            
            // Prepare audio file for upload
            const audioFile = {
                uri: currentPath,
                type: Platform.select({
                    ios: 'audio/m4a',
                    android: 'audio/mp4',
                }) || 'audio/mp4',
                fileName: `voice_${Date.now()}.${Platform.OS === 'ios' ? 'm4a' : 'mp4'}`,
            };

            console.log('[ChatScreen] Uploading audio file...');

            // Upload and send audio immediately (like WhatsApp)
            // Pass actual duration so HomeScreen can show "🎤 Voice message (0:01)"
            await sendMediaMessage(audioFile, 'audio', actualDurationSecs);
            console.log(`[ChatScreen] ✅ Recording stopped and sent successfully (duration: ${actualDurationSecs}s)`);
        } catch (error: any) {
            console.error('[ChatScreen] ❌ Error stopping recording:', error);
            
            // Try to cleanup recorder
            try {
                if (audioRecorderPlayer.current) {
                    await audioRecorderPlayer.current.stopRecorder().catch(() => {});
                }
            } catch (cleanupError) {
                // Ignore cleanup errors
            }
            
            Alert.alert(
                'Recording Error', 
                `Failed to stop recording: ${error?.message || 'Unknown error'}\n\nPlease try again.`
            );
        }
    }, [isRecording, recordSecs, sendMediaMessage]);

    /* ==================== EMOJI / KEYBOARD TOGGLE ==================== */
    // WhatsApp behavior: emoji/sticker button only manages keyboard focus
    // Emojis come from system keyboard (user taps emoji button on their keyboard)
    const handleEmojiToggle = useCallback(() => {
        if (!inputRef.current) return;

        if (isKeyboardVisible) {
            // Keyboard is open → dismiss it
            Keyboard.dismiss();
        } else {
            // Keyboard is closed → open it (focus TextInput)
            inputRef.current.focus();
        }
    }, [isKeyboardVisible]);

    // Track keyboard visibility to toggle icon correctly
    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardVisible(true);
        });

        const hideSub = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardVisible(false);
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    // Using formatMessageTime from dateUtils - shows only time (hh:mm AM/PM)

    /* ==================== RENDER MESSAGE ==================== */
    // Ensure messages are sorted by createdAt (chronological) before rendering
    const chronologicalMessages = (messages ?? []).slice().sort((a, b) => {
        const aDate = timestampToDate(a.createdAt)?.getTime() ?? 0;
        const bDate = timestampToDate(b.createdAt)?.getTime() ?? 0;
        return aDate - bDate;
    });

    // For inverted FlatList we render newest first
    let messagesForList = chronologicalMessages.slice().reverse();

    // Append a Meta AI typing indicator as the newest "message" (UI-only, not in Firestore)
    if (isMetaAIChat && isMetaAITyping) {
        messagesForList = [
            {
                id: 'meta_ai_typing',
                senderId: 'meta_ai',
                isTypingIndicator: true,
                createdAt: firestore.Timestamp.fromDate(new Date()),
            },
            ...messagesForList,
        ];
    }

    const handleOpenMediaUrl = useCallback(async (url?: string | null) => {
        if (!url) return;
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.log('[ChatScreen] Error opening media URL:', error);
            Alert.alert('Error', 'Unable to open media.');
        }
    }, []);

    const stopAudioPlayback = useCallback(async () => {
        if (!audioRecorderPlayer.current) {
            return;
        }
        try {
            await audioRecorderPlayer.current.stopPlayer?.();
            audioRecorderPlayer.current.removePlayBackListener?.();
        } catch (error) {
            console.warn('[ChatScreen] Error stopping audio playback:', error);
        } finally {
            setIsAudioPlaying(false);
            setCurrentlyPlayingMessageId(null);
            setPlaybackSecs(0);
        }
    }, []);

    const handleToggleAudioPlayback = useCallback(
        async (message: any) => {
            if (!audioRecorderPlayer.current) {
                Alert.alert(
                    'Voice Playback Unavailable',
                    'Audio playback requires react-native-audio-recorder-player.\n\nRun: npm install react-native-audio-recorder-player'
                );
                return;
            }

            if (!message?.mediaUrl) {
                return;
            }

            const isThisPlaying =
                currentlyPlayingMessageId === message.id && isAudioPlaying;

            // If this message is already playing → stop (toggle pause/stop)
            if (isThisPlaying) {
                await stopAudioPlayback();
                return;
            }

            // Stop any other playback first
            await stopAudioPlayback();

            try {
                console.log('[ChatScreen] ▶️ Starting audio playback:', message.mediaUrl);
                await audioRecorderPlayer.current.startPlayer(message.mediaUrl);
                audioRecorderPlayer.current.setVolume?.(1.0);

                setCurrentlyPlayingMessageId(message.id);
                setIsAudioPlaying(true);
                setPlaybackSecs(0);
                
                // Extract duration immediately when starting playback (if not already stored)
                // This ensures duration is available even if it wasn't stored during recording
                try {
                    const duration = await audioRecorderPlayer.current.getDuration?.(message.mediaUrl).catch(() => null);
                    if (duration && duration > 0 && message.id) {
                        const totalSecs = Math.floor(duration / 1000);
                        if (totalSecs > 0) {
                            messageDurationsRef.current[message.id] = totalSecs;
                            setExtractedDurations(prev => ({
                                ...prev,
                                [message.id]: totalSecs,
                            }));
                        }
                    }
                } catch (error) {
                    // Ignore - duration will be extracted from playback listener
                }

                audioRecorderPlayer.current.addPlayBackListener((e: any) => {
                    if (!e) return;
                    const currentMs = e.currentPosition ?? 0;
                    const durationMs = e.duration ?? 0;

                    // Update playback position (starts from 0:00 and counts up to duration)
                    const secs = Math.floor(currentMs / 1000);
                    setPlaybackSecs(secs);

                    // Extract and store duration if not already stored in message
                    // This ensures receiver sees correct duration even if sender didn't store it
                    if (durationMs > 0 && !message.duration && !message.durationSecs) {
                        const totalSecs = Math.floor(durationMs / 1000);
                        // Store duration in ref and state for UI display (UI-only, not Firestore)
                        if (totalSecs > 0 && message.id) {
                            messageDurationsRef.current[message.id] = totalSecs;
                            setExtractedDurations(prev => ({
                                ...prev,
                                [message.id]: totalSecs,
                            }));
                        }
                    }

                    if (durationMs > 0 && currentMs >= durationMs) {
                        // Playback finished
                        stopAudioPlayback();
                    }
                });
            } catch (error: any) {
                console.error('[ChatScreen] ❌ Error playing audio message:', error);
                Alert.alert('Error', 'Failed to play audio message. Please try again.');
                await stopAudioPlayback();
            }
        },
        [audioRecorderPlayer, currentlyPlayingMessageId, isAudioPlaying, stopAudioPlayback],
    );

    const renderMessage = ({ item, index }: any) => {
        // Meta AI typing indicator bubble (UI-only)
        if (item.isTypingIndicator) {
            return (
                <View style={[styles.messageRow, styles.messageRowOther]}>
                    <View style={[styles.messageBubble, styles.otherMessage]}>
                        <View style={styles.typingDotsRow}>
                            <View style={styles.typingDot} />
                            <View style={styles.typingDot} />
                            <View style={styles.typingDot} />
                        </View>
                    </View>
                </View>
            );
        }
        const isMe = item.senderId === currentUserUid;
        const messageType: 'text' | 'media' = item.messageType || 'text';
        // Use formatMessageTime - shows only time (hh:mm AM/PM), no date
        const timeStr = formatMessageTime(item.createdAt);
        
        // Check if we need to show a date separator.
        // IMPORTANT: This is based strictly on the chronological (ascending) message order,
        // not on the inverted FlatList order or typing indicators.
        const showDateSeparator = (() => {
            if (!item.createdAt) return false;

            // Find this message in the chronological list
            const chronologicalIndex = chronologicalMessages.findIndex(m => m.id === item.id);
            if (chronologicalIndex === -1) return false;

            if (chronologicalIndex === 0) {
                // First real message in the chat – always show separator
                return true;
            }

            const prevMessage = chronologicalMessages[chronologicalIndex - 1];
            if (!prevMessage || !prevMessage.createdAt) return false;

            const prevDate = timestampToDate(prevMessage.createdAt);
            const currentDate = timestampToDate(item.createdAt);
            if (!prevDate || !currentDate) return false;

            // Separator only when calendar day changes
            return !isSameDay(prevDate, currentDate);
        })();

        // Get date separator label if needed – STRICTLY from Firestore timestamp
        const messageDate = timestampToDate(item.createdAt);
        const dateSeparatorLabel =
            showDateSeparator && messageDate
                ? formatDateSeparator(messageDate)
                : null;

        const isAudioMedia =
            messageType === 'media' && item.mediaType === 'audio' && !!item.mediaUrl;
        const isThisAudioPlaying =
            isAudioMedia && currentlyPlayingMessageId === item.id && isAudioPlaying;

        // STEP 4: Format duration correctly (0:SS or M:SS)
        const formatDuration = (totalSecs: number): string => {
            if (!totalSecs || totalSecs < 0) {
                return '0:00';
            }
            const minutes = Math.floor(totalSecs / 60);
            const seconds = totalSecs % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        };

        const isSelected = selectedMessageIds.has(item.id);
        const isSelectionMode = selectedMessageIds.size > 0;

        return (
            <View>
                {showDateSeparator && dateSeparatorLabel && (
                    <DateSeparator label={dateSeparatorLabel} />
                )}
                <TouchableOpacity
                    style={[
                        styles.messageRow,
                        isMe ? styles.messageRowMe : styles.messageRowOther,
                        isSelected && styles.messageSelected,
                    ]}
                    onLongPress={() => {
                        // Long press: toggle selection ON
                        setSelectedMessageIds(prev => {
                            const newSet = new Set(prev);
                            newSet.add(item.id);
                            return newSet;
                        });
                    }}
                    onPress={() => {
                        // Normal tap: if selection mode is active, toggle selection
                        // Otherwise, normal message behavior (disabled during selection)
                        if (isSelectionMode) {
                            setSelectedMessageIds(prev => {
                                const newSet = new Set(prev);
                                if (newSet.has(item.id)) {
                                    newSet.delete(item.id);
                                } else {
                                    newSet.add(item.id);
                                }
                                return newSet;
                            });
                        }
                    }}
                    activeOpacity={isSelectionMode ? 0.7 : 1}
                >
                    <View
                        style={[
                            styles.messageBubble,
                            isMe 
                                ? [styles.myMessage, { backgroundColor: theme.bubbleSent }]
                                : [styles.otherMessage, { backgroundColor: theme.bubbleReceived }],
                            isSelected && { opacity: 0.7 },
                        ]}
                    >
                        {messageType === 'media' && item.mediaUrl ? (
                            item.mediaType === 'image' ? (
                                <Image
                                    source={{ uri: item.mediaUrl }}
                                    style={styles.mediaImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                item.mediaType === 'audio' ? (
                                    <View style={styles.voiceMessageContainer}>
                                <TouchableOpacity
                                            style={styles.voiceMessageRow}
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                // Disable playback during selection mode
                                                if (!isSelectionMode) {
                                                    handleToggleAudioPlayback(item);
                                                }
                                            }}
                                            disabled={isSelectionMode}
                                        >
                                            {/* Play/Pause button - circular, WhatsApp-like */}
                                            <View style={styles.voicePlayButton}>
                                                <Image
                                                    source={
                                                        isThisAudioPlaying
                                                            ? require('../../../assets/icons/pause.png')
                                                            : require('../../../assets/icons/play.png')
                                                    }
                                                    style={[
                                                        styles.voicePlayIcon,
                                                        {
                                                            // Grey in light theme, white in dark theme
                                                            tintColor: isDark
                                                                ? theme.white
                                                                : theme.textSecondary,
                                                        },
                                                    ]}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                            
                                            {/* Duration next to play button - grey in light theme, white in dark theme */}
                                            <Text
                                                style={[
                                                    styles.voiceDurationText,
                                                    {
                                                        color: isDark
                                                            ? theme.white
                                                            : theme.textSecondary,
                                                    },
                                                ]}
                                            >
                                                {formatDuration(
                                                    isThisAudioPlaying 
                                                        ? playbackSecs 
                                                        : (item.duration || item.durationSecs || extractedDurations[item.id] || messageDurationsRef.current[item.id] || 0),
                                                )}
                                            </Text>
                                            
                                            {/* Waveform with simple progress indication (left → right) */}
                                            <View style={styles.voiceWaveform}>
                                                {Array.from({ length: 20 }).map((_, i) => {
                                                    const totalDuration =
                                                        item.duration ||
                                                        item.durationSecs ||
                                                        extractedDurations[item.id] ||
                                                        messageDurationsRef.current[item.id] ||
                                                        0;
                                                    const barsCount = 20;
                                                    const progressRatio =
                                                        isThisAudioPlaying && totalDuration > 0
                                                            ? Math.min(
                                                                  playbackSecs / totalDuration,
                                                                  1,
                                                              )
                                                            : 0;
                                                    const filledBars = Math.round(progressRatio * barsCount);

                                                    // Generate consistent waveform heights based on message ID
                                                    const seed = (item.id?.charCodeAt(0) || 0) + i;
                                                    const height = (seed % 8) + 4; // Heights between 4-11
                                                    return (
                                                        <View
                                                            key={i}
                                                            style={[
                                                                styles.voiceWaveformBar,
                                                                {
                                                                    height,
                                                                    // Same color as icon: grey in light theme, white in dark theme
                                                                    backgroundColor: isDark
                                                                        ? theme.white
                                                                        : theme.textSecondary,
                                                                    opacity:
                                                                        i < filledBars
                                                                            ? 1
                                                                            : 0.35,
                                                                }
                                                            ]}
                                                        />
                                                    );
                                                })}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => {
                                            // Disable media opening during selection mode
                                            if (!isSelectionMode) {
                                                handleOpenMediaUrl(item.mediaUrl);
                                            }
                                        }}
                                    activeOpacity={0.7}
                                        disabled={isSelectionMode}
                                    >
                                        <Text
                                            style={[
                                                styles.mediaFileText,
                                                { color: theme.whatsappBlue },
                                            ]}
                                        >
                                        {item.mediaType === 'video'
                                            ? 'Open video'
                                            : 'Open file'}
                                    </Text>
                                </TouchableOpacity>
                                )
                            )
                        ) : (
                            <Text style={[styles.messageText, { color: theme.textPrimary }]}>
                                {item.text}
                            </Text>
                        )}
                        
                        {/* Timestamp and ticks inside bubble */}
                        <View style={styles.messageFooter}>
                            <Text style={[styles.messageTime, { color: theme.bubbleTimestamp }]}>
                                {timeStr}
                            </Text>
                            {isMe && (() => {
                                // META AI SPECIAL HANDLING: Meta AI is a system chat, not a real user
                                // User messages to Meta AI are always "delivered" (saved to system)
                                // There is no "seen by other user" concept for Meta AI
                                if (isMetaAIChat) {
                                    // For Meta AI: always show delivered ticks (✔✔ gray)
                                    // Meta AI is system, so user messages are always delivered when saved
                                    const isDelivered = item.delivered !== false; // Default to true for Meta AI
                                    
                                    return (
                                        <Text
                                            style={[
                                                styles.tickText,
                                                { color: theme.textTertiary }, // Always gray double tick for Meta AI
                                            ]}
                                        >
                                            {'✔✔'}
                                        </Text>
                                    );
                                }
                                
                                // NORMAL CHAT HANDLING
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
                                // CRITICAL: Never downgrade - if message was already delivered/seen, preserve that state
                                const wasDelivered = item.delivered === true;
                                const wasSeen = isSeen;
                                
                                // Tick display logic:
                                // - Single tick (✔) gray = sent but not delivered
                                // - Double tick (✔✔) gray = delivered but not seen
                                // - Double tick (✔✔) blue = seen
                                // NEVER downgrade: once delivered/seen, stay that way
                                
                                const isDelivered = wasDelivered;
                                const finalIsSeen = wasSeen;
                                
                                return (
                                    <Text
                                        style={[
                                            styles.tickText,
                                            { color: finalIsSeen ? theme.whatsappBlue : theme.textTertiary },
                                        ]}
                                    >
                                        {finalIsSeen ? '✔✔' : (isDelivered ? '✔✔' : '✔')}
                                    </Text>
                                );
                            })()}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    /* ==================== DELETE MESSAGES ==================== */
    /**
     * Extract Cloudinary public_id from URL.
     *
     * For audio/files we keep the extension in the public_id because Cloudinary
     * often stores raw/audio assets with the extension as part of public_id:
     *   public_id: "whatsapp_clone/xyz123.mp4"
     *
     * For images / videos we strip the extension because their public_id is
     * usually stored without it:
     *   URL: .../upload/v123/whatsapp_clone/abc123.jpg
     *   public_id: "whatsapp_clone/abc123"
     */
    const extractCloudinaryPublicId = (
        url: string,
        mediaType?: 'audio' | 'video' | 'image' | 'file' | string
    ): string | null => {
        try {
            // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{format}
            // Example with folder: https://res.cloudinary.com/dzhaqez4q/image/upload/v1234567890/whatsapp_clone/abc123.jpg
            // Example without folder: https://res.cloudinary.com/dzhaqez4q/image/upload/v1234567890/abc123.jpg
            // Match everything after /upload/v{version}/
            const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
            if (match && match[1]) {
                const fullId = match[1]; // may include extension, e.g. whatsapp_clone/xyz123.mp4

                // For audio/file, keep extension to match Cloudinary's raw/audio public_id
                if (mediaType === 'audio' || mediaType === 'file') {
                    console.log('[ChatScreen] ✅ Extracted public_id (audio/file, with ext):', {
                        url,
                        publicId: fullId,
                    });
                    return fullId;
                }

                // For image/video, strip final extension if present
                const withoutExt = fullId.replace(/\.[^.]+$/, '');
                console.log('[ChatScreen] ✅ Extracted public_id:', {
                    url,
                    publicId: withoutExt,
                });
                return withoutExt;
            }
            console.warn('[ChatScreen] ⚠️ Could not extract public_id from URL:', url);
            return null;
        } catch (error) {
            console.error('[ChatScreen] Error extracting Cloudinary public_id:', error);
            return null;
        }
    };

    /**
     * Delete media from Cloudinary via backend API
     * This ensures secure deletion using API credentials stored on backend
     */
    const deleteFromCloudinary = async (publicId: string, resourceType: string = 'image'): Promise<boolean> => {
        try {
            console.log('[ChatScreen] 🗑️ Deleting from Cloudinary via backend:', { publicId, resourceType });

            const response = await fetch(`${API_BASE_URL}/api/cloudinary/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    publicId,
                    resourceType,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.warn('[ChatScreen] ⚠️ Backend Cloudinary delete failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData.error || errorData,
                    publicId,
                    resourceType,
                });
                // Return false but don't block Firestore deletion
                return false;
            }

            const data = await response.json();
            if (data.success) {
                console.log('[ChatScreen] ✅ Cloudinary delete successful via backend:', {
                    publicId,
                    resourceType,
                    result: data.result,
                });
                return true;
            }

            console.warn('[ChatScreen] ⚠️ Backend returned success=false:', data);
            return false;
        } catch (error: any) {
            console.warn('[ChatScreen] ⚠️ Error calling backend delete API (non-critical):', {
                error: error.message || error,
                publicId,
                resourceType,
            });
            // Don't throw - Firestore cleanup is more important
            return false;
        }
    };

    /**
     * Delete multiple media files from Cloudinary via backend API (batch operation)
     */
    /**
     * Delete multiple media files from Cloudinary via backend API (batch operation)
     * Backend automatically handles resource type detection (tries 'video' first for audio files)
     */
    const deleteMultipleFromCloudinary = async (
        files: Array<{ 
            publicId: string; 
            resourceType: 'image' | 'video' | 'raw';
            originalMediaType?: 'audio' | 'video' | 'image' | 'file';
        }>
    ): Promise<boolean> => {
        if (files.length === 0) {
            return true;
        }

        try {
            console.log('[ChatScreen] 🗑️ Deleting multiple files from Cloudinary via backend:', {
                count: files.length,
                files: files.map(f => ({ 
                    publicId: f.publicId, 
                    resourceType: f.resourceType,
                    originalMediaType: f.originalMediaType,
                })),
            });

            const response = await fetch(`${API_BASE_URL}/api/cloudinary/delete-multiple`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ files }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.warn('[ChatScreen] ⚠️ Backend batch delete failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData.error || errorData,
                    count: files.length,
                });
                return false;
            }

            const data = await response.json();
            if (data.success) {
                // Log detailed results including actual resource types used
                const successfulDeletes = data.results.filter((r: any) => r.success && r.result === 'ok');
                const notFoundDeletes = data.results.filter((r: any) => r.success && r.result === 'not found');
                const failedDeletes = data.results.filter((r: any) => !r.success);

                console.log('[ChatScreen] ✅ Batch Cloudinary delete completed via backend:', {
                    total: data.total,
                    successful: data.successful,
                    failed: data.failed,
                    deleted: successfulDeletes.length,
                    notFound: notFoundDeletes.length,
                    failedCount: failedDeletes.length,
                    results: data.results.map((r: any) => ({
                        publicId: r.publicId,
                        success: r.success,
                        result: r.result,
                        actualResourceType: r.actualResourceType,
                        error: r.error,
                    })),
                });

                // Consider it successful if all files were either deleted or not found
                // (not found means file doesn't exist, which is fine)
                return failedDeletes.length === 0;
            }

            console.warn('[ChatScreen] ⚠️ Backend batch delete returned success=false:', data);
            return false;
        } catch (error: any) {
            console.warn('[ChatScreen] ⚠️ Error calling backend batch delete API (non-critical):', {
                error: error.message || error,
                count: files.length,
            });
            return false;
        }
    };

    const handleDeleteMessages = useCallback(async () => {
        if (selectedMessageIds.size === 0 || !currentUserUid || !chatId) {
            return;
        }

        // Show confirmation dialog
        Alert.alert(
            selectedMessageIds.size === 1 ? 'Delete message?' : `Delete ${selectedMessageIds.size} messages?`,
            selectedMessageIds.size === 1
                ? 'This message will be deleted.'
                : `These ${selectedMessageIds.size} messages will be deleted.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const messagesToDelete = Array.from(selectedMessageIds);
                            const chatRoomRef = firestore()
                                .collection('chatRooms')
                                .doc(chatId);
                            const messagesRef = chatRoomRef.collection('messages');

                            // Get message data before deleting (to check for media)
                            const messageSnaps = await Promise.all(
                                messagesToDelete.map(id => messagesRef.doc(id).get())
                            );

                            // Delete from Firestore and collect media URLs
                            // Use batch delete for atomicity and better performance
                            const batch = firestore().batch();
                            const mediaToDelete: Array<{ url: string; mediaType: string }> = [];
                            
                            for (const snap of messageSnaps) {
                                if (!snap.exists) continue;
                                
                                const messageData = snap.data();
                                
                                // Check if message has media
                                if (messageData?.mediaUrl && messageData?.mediaType) {
                                    mediaToDelete.push({
                                        url: messageData.mediaUrl,
                                        mediaType: messageData.mediaType,
                                    });
                                }
                                
                                // Add to batch for deletion
                                batch.delete(snap.ref);
                            }
                            
                            // Commit batch delete (atomic operation)
                            await batch.commit();

                            // Delete from Cloudinary via backend (only for media messages)
                            // Collect all files to delete for batch operation
                            // Include originalMediaType to help backend detect correct resource_type
                            const cloudinaryFiles: Array<{ 
                                publicId: string; 
                                resourceType: 'image' | 'video' | 'raw';
                                originalMediaType?: 'audio' | 'video' | 'image' | 'file';
                            }> = [];
                            
                            for (const media of mediaToDelete) {
                                // Extract public_id with mediaType hint so audio/files keep extension
                                const publicId = extractCloudinaryPublicId(
                                    media.url,
                                    media.mediaType as 'audio' | 'video' | 'image' | 'file' | undefined
                                );
                                if (publicId) {
                                    // Determine resource type for initial attempt
                                    // Backend will automatically try all resource types for robustness
                                    let resourceType: 'image' | 'video' | 'raw' = 'image';
                                    if (media.mediaType === 'video') {
                                        resourceType = 'video';
                                    } else if (media.mediaType === 'audio' || media.mediaType === 'file') {
                                        resourceType = 'raw';
                                    }
                                    
                                    cloudinaryFiles.push({ 
                                        publicId, 
                                        resourceType,
                                        originalMediaType: media.mediaType as 'audio' | 'video' | 'image' | 'file',
                                    });
                                }
                            }

                            // Delete all files in batch via backend (non-blocking)
                            if (cloudinaryFiles.length > 0) {
                                deleteMultipleFromCloudinary(cloudinaryFiles).catch(error => {
                                    console.warn('[ChatScreen] ⚠️ Batch Cloudinary deletion failed (non-critical):', error);
                                });
                            }

                            // Update chat room lastMessage if deleted message was the last one
                            const remainingMessagesSnap = await messagesRef
                                .orderBy('createdAt', 'desc')
                                .limit(1)
                                .get();

                            if (remainingMessagesSnap.empty) {
                                // No messages left - clear lastMessage
                                await chatRoomRef.update({
                                    lastMessage: null,
                                    lastMessageAt: null,
                                    lastMessageTime: null,
                                    lastMessageSenderId: null,
                                    updatedAt: firestore.FieldValue.serverTimestamp(),
                                });
                            } else {
                                // Update lastMessage to the most recent remaining message
                                const lastMessageData = remainingMessagesSnap.docs[0].data();
                                
                                // Helper function to format duration
                                const formatDuration = (secs: number) => {
                                    const minutes = Math.floor(secs / 60);
                                    const seconds = secs % 60;
                                    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                                };
                                
                                const lastMessageText = lastMessageData.text || 
                                    (lastMessageData.mediaType === 'audio' 
                                        ? `🎤 Voice message (${formatDuration(lastMessageData.durationSecs || 0)})`
                                        : lastMessageData.mediaType === 'image' 
                                        ? '📷 Photo'
                                        : lastMessageData.mediaType === 'video'
                                        ? '🎥 Video'
                                        : '📎 File');
                                
                                await chatRoomRef.update({
                                    lastMessage: {
                                        text: lastMessageText,
                                        senderId: lastMessageData.senderId,
                                        timestamp: lastMessageData.createdAt,
                                        seenBy: lastMessageData.seenBy || [],
                                        mediaType: lastMessageData.mediaType || null,
                                    },
                                    lastMessageAt: lastMessageData.createdAt,
                                    lastMessageTime: lastMessageData.createdAt,
                                    lastMessageSenderId: lastMessageData.senderId,
                                    updatedAt: firestore.FieldValue.serverTimestamp(),
                                });
                            }

                            // Clear selection
                            setSelectedMessageIds(new Set());
                            
                            console.log('[ChatScreen] ✅ Deleted', messagesToDelete.length, 'message(s)');
                        } catch (error: any) {
                            console.error('[ChatScreen] ❌ Error deleting messages:', error);
                            Alert.alert('Error', 'Failed to delete messages. Please try again.');
                        }
                    },
                },
            ]
        );
    }, [selectedMessageIds, currentUserUid, chatId]);

    const handleClearSelection = useCallback(() => {
        setSelectedMessageIds(new Set());
    }, []);

    // Clear selection when screen loses focus (user navigates away)
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            // Clear selection when navigating away
            setSelectedMessageIds(new Set());
        });

        return unsubscribe;
    }, [navigation]);

    // Handle back button press - clear selection if in selection mode
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (selectedMessageIds.size > 0) {
                // If in selection mode, clear selection instead of navigating back
                e.preventDefault();
                setSelectedMessageIds(new Set());
            }
        });

        return unsubscribe;
    }, [navigation, selectedMessageIds.size]);

    /* ==================== UI ==================== */
    const isSelectionMode = selectedMessageIds.size > 0;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.chatBackgroundLight }]}>
            {/* Header - Show selection bar if messages are selected */}
            {isSelectionMode ? (
                <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
                <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleClearSelection}
                    >
                        <Image
                            source={require('../../../assets/icons/back.png')}
                            style={[styles.backIcon, { tintColor: theme.textPrimary }]}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    
                    <View style={styles.headerInfo}>
                        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
                            {selectedMessageIds.size} {selectedMessageIds.size === 1 ? 'message' : 'messages'}
                        </Text>
                    </View>
                    
                    <View style={styles.headerActions}>
                        {/* Star icon (UI only) */}
                        <TouchableOpacity style={styles.headerActionButton}>
                            <Image
                                source={require('../../../assets/icons/favourite.png')}
                                style={[styles.headerActionIcon, { tintColor: theme.textPrimary }]}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        
                        {/* Delete icon (FUNCTIONAL) */}
                        <TouchableOpacity 
                            style={styles.headerActionButton}
                            onPress={handleDeleteMessages}
                        >
                            <Image
                                source={require('../../../assets/icons/delete.png')}
                                style={[
                                    styles.headerActionIcon,
                                    {
                                        // Always black delete icon
                                        tintColor: '#000000',
                                    },
                                ]}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        
                        {/* Forward icon (UI only) - reuse chat icon as a forward/share analogue */}
                        <TouchableOpacity style={styles.headerActionButton}>
                            <Image
                                source={require('../../../assets/icons/whatsapp-chat.png')}
                                style={[styles.headerActionIcon, { tintColor: theme.textPrimary }]}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        
                        {/* Menu icon (UI only) */}
                        <TouchableOpacity style={styles.menuButton}>
                            <Image
                                source={require('../../../assets/icons/menu-bar.png')}
                                style={[styles.menuIcon, { tintColor: theme.textPrimary }]}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={require('../../../assets/icons/back.png')}
                        style={[styles.backIcon, { tintColor: theme.textPrimary }]}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                
                <View style={styles.avatarContainer}>
                    {isMetaAIChat ? (
                        <MetaAIAvatar size={40} />
                    ) : (
                        (() => {
                            // Check if user is unknown (phone number only, no saved name) - same logic as HomeScreen
                            const isUnknownUser = !isSelfChat && (
                                !chatName || 
                                chatName === 'Unknown' || 
                                (chatName.startsWith('+') && /^\+[0-9]+$/.test(chatName)) ||
                                (otherUserPhone && chatName === otherUserPhone)
                            );
                            
                            if (isUnknownUser) {
                                // Show unknown-user icon
                                return (
                                    <Image
                                        source={require('../../../assets/icons/unknown-user.png')}
                                        style={styles.unknownUserAvatar}
                                        resizeMode="contain"
                                    />
                                );
                            } else {
                                // Show initials avatar
                                return (
                                    <View style={[styles.avatar, { backgroundColor: theme.whatsappGreen }]}>
                                        <Text style={[styles.avatarText, { color: theme.white }]}>
                                            {isSelfChat ? 'M' : (chatName?.charAt(0) || '?')}
                                        </Text>
                                    </View>
                                );
                            }
                        })()
                    )}
                </View>
                
                <TouchableOpacity
                    style={styles.headerInfo}
                    onPress={() => {
                        if (!isMetaAIChat && !isSelfChat && otherUserUid) {
                            (navigation as any).navigate('ContactProfile', {
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
                            <Text style={[styles.headerTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                                Meta AI
                            </Text>
                            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
                                with Llama 4
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text style={[styles.headerTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                                {isSelfChat ? 'My Number (You)' : (chatName || otherUserPhone || 'Unknown')}
                            </Text>
                            {!isSelfChat && otherUserPhone && chatName !== otherUserPhone && (
                                <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
                                    {otherUserPhone}
                                </Text>
                            )}
                            {isSelfChat && (
                                <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
                                    Message yourself
                                </Text>
                            )}
                        </>
                    )}
                </TouchableOpacity>
                
                <View style={styles.headerActions}>
                    {isMetaAIChat ? (
                        <TouchableOpacity 
                            style={styles.menuButton}
                            onPress={handleMenuPress}
                        >
                            <Image
                                source={require('../../../assets/icons/menu-bar.png')}
                                style={[styles.menuIcon, { tintColor: theme.textPrimary }]}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.headerActionButton}>
                                <Image
                                    source={require('../../../assets/icons/video-call.png')}
                                    style={[styles.headerActionIcon, { tintColor: theme.textPrimary }]}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerActionButton}>
                                <Image
                                    source={require('../../../assets/icons/whatsapp-calls.png')}
                                    style={[styles.headerActionIcon, { tintColor: theme.textPrimary }]}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.menuButton}
                                onPress={handleMenuPress}
                            >
                                <Image
                                source={require('../../../assets/icons/menu-bar.png')}
                                style={[styles.menuIcon, { tintColor: theme.textPrimary }]}
                                resizeMode="contain"
                            />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
            )}

            {/* Messages with Background (wallpaper edge-to-edge) */}
            <ImageBackground
                source={require('../../../assets/images/Wchat-background.jpg')}
                style={[styles.backgroundImage, { backgroundColor: theme.chatBackgroundLight }]}
                // Very light wallpaper so icons are subtle, like WhatsApp
                // In dark mode, darken the wallpaper significantly
                imageStyle={{ opacity: isDark ? 0.05 : 0.15 }}
                resizeMode="cover"
            >
                {/* Hard gate: do not render any message UI until the first snapshot/cache resolves */}
                {!hasInitialSnapshot ? null : messages && isMetaAIChat && messages.length === 0 ? (
                    // First-time Meta AI screen (only when we truly have no messages)
                    <MetaAIFirstTimeScreen
                        userName={userName || 'User'}
                        onSuggestionPress={(suggestion) => {
                            setText(suggestion);
                        }}
                    />
                ) : messages && messages.length > 0 ? (
                    <FlatList
                        data={messagesForList}
                        keyExtractor={item => item.id}
                        renderItem={renderMessage}
                        contentContainerStyle={styles.messageList}
                        inverted
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={() => (
                            <>
                                {/* Encryption banner: one-time header at top of chat (non Meta AI) */}
                                {!isMetaAIChat && (
                                    <View style={[styles.encryptionBanner, { backgroundColor: theme.encryptionBanner }]}>
                                        <Text style={styles.encryptionIcon}>🔒</Text>
                                        <Text style={[styles.encryptionText, { color: theme.textSecondary }]}>
                                            Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them. Learn more.
                                        </Text>
                                    </View>
                                )}

                                {/* Meta AI system disclaimer (only for Meta AI chats with messages) */}
                                {isMetaAIChat && messages && messages.length > 0 && (
                                    <View style={{ paddingVertical: spacing.sm }}>
                                        <View style={styles.systemMessage}>
                                            <Text style={styles.systemMessageText}>
                                                Messages are generated by AI. Some may be inaccurate or inappropriate. Learn more.
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </>
                        )}
                    />
                ) : null}
            </ImageBackground>

            {/* Input Bar */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                {/* Pending Media Preview Row */}
                {pendingMedia && (
                    <View style={[styles.pendingMediaContainer, { backgroundColor: theme.background }]}>
                        <View style={[styles.pendingMediaRow, { backgroundColor: theme.backgroundInput }]}>
                            {/* Thumbnail or icon */}
                            {pendingMedia.mediaType === 'image' && pendingMedia.file.uri ? (
                                <Image
                                    source={{ uri: pendingMedia.file.uri }}
                                    style={styles.pendingMediaThumbnail}
                                    resizeMode="cover"
                                />
                            ) : pendingMedia.mediaType === 'video' && pendingMedia.file.uri ? (
                                <View style={styles.pendingMediaThumbnail}>
                                    <Image
                                        source={{ uri: pendingMedia.file.uri }}
                                        style={styles.pendingMediaThumbnail}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.videoPlayOverlay}>
                                        <Text style={styles.videoPlayIcon}>▶</Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={[styles.pendingMediaIconContainer, { backgroundColor: theme.whatsappGreen }]}>
                                    <Text style={[styles.pendingMediaIcon, { color: theme.white }]}>
                                        {pendingMedia.mediaType === 'audio' ? '🎵' : '📄'}
                                    </Text>
                                </View>
                            )}
                            
                            {/* File name */}
                            <View style={styles.pendingMediaInfo}>
                                <Text 
                                    style={[styles.pendingMediaFileName, { color: theme.textPrimary }]}
                                    numberOfLines={1}
                                >
                                    {pendingMedia.file.fileName || 
                                     pendingMedia.file.name || 
                                     (pendingMedia.mediaType === 'image' ? 'Image' : 
                                      pendingMedia.mediaType === 'video' ? 'Video' : 
                                      pendingMedia.mediaType === 'audio' ? 'Audio' : 'File')}
                                </Text>
                                {pendingMedia.file.fileSize && (
                                    <Text style={[styles.pendingMediaFileSize, { color: theme.textSecondary }]}>
                                        {(pendingMedia.file.fileSize / 1024 / 1024).toFixed(2)} MB
                                    </Text>
                                )}
                            </View>
                            
                            {/* Cancel button */}
                            <TouchableOpacity
                                style={styles.pendingMediaCancelButton}
                                onPress={() => setPendingMedia(null)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.pendingMediaCancelIcon, { color: theme.textSecondary }]}>❌</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                
                <View style={[styles.inputContainer, { backgroundColor: theme.background }]}>
                    {/* Main pill container: sticker + input + attach + camera (WhatsApp-like) */}
                    <View style={[styles.inputWrapper, { backgroundColor: theme.backgroundInput }]}>
                        {/* Emoji / keyboard toggle on the left inside the pill (WhatsApp-like) */}
                        <TouchableOpacity
                            style={styles.stickerButton}
                            onPress={handleEmojiToggle}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={
                                    isKeyboardVisible
                                        ? require('../../../assets/icons/keyboard.png')
                                        : require('../../../assets/icons/sticker.png')
                                }
                                style={[styles.stickerIcon, { tintColor: theme.iconGray }]}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>

                        {/* Text input */}
                        <TextInput
                            ref={inputRef}
                            style={[styles.input, { color: theme.textPrimary }]}
                            placeholder="Message"
                            placeholderTextColor={theme.textTertiary}
                            value={text}
                            onFocus={() => {
                                // Keyboard will show, visibility state updated via keyboardDidShow listener
                            }}
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

                        {/* Attach and camera icons on the right inside the pill */}
                        {!text.trim() && !pendingMedia && (
                            <>
                                <TouchableOpacity 
                                    style={styles.attachButton}
                                    onPress={handleAttachDocument}
                                >
                                    <Image
                                        source={require('../../../assets/icons/attach-document.png')}
                                        style={[styles.attachIcon, { tintColor: theme.iconGray }]}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.cameraButton}
                                    onPress={handleOpenCamera}
                                >
                                    <Image
                                        source={require('../../../assets/icons/whatsapp-camera.png')}
                                        style={[styles.cameraIcon, { tintColor: theme.iconGray }]}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                    
                    {/* Send button or mic button to the right of the pill */}
                    {(text.trim() || pendingMedia) ? (
                        <TouchableOpacity
                            style={[styles.sendButton, { backgroundColor: theme.whatsappGreen }]}
                            onPress={handleSendMessage}
                        >
                            <Text style={[styles.sendIcon, { color: theme.white }]}>➤</Text>
                        </TouchableOpacity>
                    ) : (
                        <View
                            onTouchMove={(e: any) => {
                                // Detect slide-to-cancel gesture
                                if (isRecording && micButtonRef.current) {
                                    const { pageX, pageY } = e.nativeEvent;
                                    micButtonRef.current.measure((x, y, width, height, pageXBtn, pageYBtn) => {
                                        const buttonCenterX = pageXBtn + width / 2;
                                        const buttonCenterY = pageYBtn + height / 2;
                                        const distance = Math.sqrt(
                                            Math.pow(pageX - buttonCenterX, 2) + Math.pow(pageY - buttonCenterY, 2)
                                        );
                                        // If finger is more than 50px away from button center, cancel
                                        if (distance > 50) {
                                            setIsSlidingToCancel(true);
                                        } else {
                                            setIsSlidingToCancel(false);
                                        }
                                    });
                                }
                            }}
                        >
                            <TouchableOpacity
                                ref={micButtonRef}
                                style={[
                                    styles.micButton,
                                    isRecording && { backgroundColor: theme.textSecondary },
                                    isSlidingToCancel && { backgroundColor: '#FF3B30' }
                                ]}
                                onPressIn={handleStartRecording}
                                onPressOut={() => {
                                    // Check if user slid away (cancel) or released normally (send)
                                    if (isSlidingToCancel) {
                                        handleStopRecordingAndSend(true); // Cancel
                                    } else {
                                        handleStopRecordingAndSend(false); // Send
                                    }
                                }}
                                activeOpacity={0.8}
                            >
                                {isRecording ? (
                                    <View style={{ alignItems: 'center' }}>
                                        {isSlidingToCancel ? (
                                            <Text style={styles.micTimerText}>
                                                Slide to cancel
                                            </Text>
                                        ) : (
                                            <Text style={styles.micTimerText}>
                                                {Math.floor(recordSecs / 60)}:{(recordSecs % 60).toString().padStart(2, '0')}
                                            </Text>
                                        )}
                                    </View>
                                ) : (
                            <Image
                                source={require('../../../assets/icons/voice-message.png')}
                                        style={[
                                            styles.micIcon,
                                            // WhatsApp-like: white mic icon on green circular button
                                            { tintColor: theme.white }
                                        ]}
                                resizeMode="contain"
                            />
                                )}
                        </TouchableOpacity>
                        </View>
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

export { ChatScreen };
