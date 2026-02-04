import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { homeScreenStyles } from '../styles/HomeScreen.styles';
import { useTheme } from '../../../contexts/ThemeContext';
import type { RootStackParamList } from '../../../types/navigation';
import { MenuBar } from '../components/MenuBar';
import { getUserData } from '../../../services/userService';
import { MetaAIAvatar } from '../../../components/chat/MetaAIAvatar';
import { registerForPushNotifications } from '../../../services/notificationService';

/* -------------------- Navigation Type -------------------- */
type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<{ Chats: undefined }>,
  NativeStackNavigationProp<RootStackParamList>
>;

/* -------------------- Chat Item -------------------- */
const ChatItem = React.memo(
  ({
    chat,
    currentUserUid,
    onPress,
    formatTime,
    theme,
  }: {
    chat: any;
    currentUserUid: string;
    onPress: () => void;
    formatTime: (timestamp: any) => string;
    theme: any;
  }) => {
    const unread = chat.unreadCount?.[currentUserUid] || 0;
    
    // Get last message text (handle both old string format and new object format)
    let lastMessageText = typeof chat.lastMessage === 'string' 
      ? chat.lastMessage 
      : chat.lastMessage?.text || 'No messages yet';
    
    const isVoiceMessage =
      typeof chat.lastMessage === 'object' && chat.lastMessage?.mediaType === 'audio';

    // If it's a voice message, remove any leading emoji and keep clean text
    if (isVoiceMessage) {
      // Strip leading 🎤 emoji if present so we can use the mic icon instead
      lastMessageText = lastMessageText.replace(/^🎤\s*/, '') || 'Voice message';
    }
    
    // Get last message timestamp
    const lastMessageTime = chat.lastMessageTime || chat.lastMessage?.timestamp;
    
    // Determine if self-chat
    const isSelfChat = chat.participants?.length === 1 && chat.participants[0] === currentUserUid;
    
    // Get ticks status (only for messages sent by current user)
    const lastMessageSenderId = typeof chat.lastMessage === 'object' ? chat.lastMessage?.senderId : null;
    const isMyMessage = lastMessageSenderId === currentUserUid;
    
    // For ticks: check if OTHER user has seen MY message
    // Get other user UID
    const otherUserUid = isSelfChat 
      ? currentUserUid 
      : chat.participants?.find((uid: string) => uid !== currentUserUid) || currentUserUid;
    
    const seenBy = typeof chat.lastMessage === 'object' ? chat.lastMessage?.seenBy || [] : [];
    // Message is seen if OTHER user's UID is in seenBy array
    const isSeen = isMyMessage && (seenBy.includes(otherUserUid) || (isSelfChat && seenBy.includes(currentUserUid)));
    const isDelivered = isMyMessage && (isSeen || isSelfChat || chat.lastMessage?.delivered);
    
    // Render ticks
    const renderTicks = () => {
      if (!isMyMessage) return null;
      
      if (isSeen || isSelfChat) {
        // Blue double tick (seen by other user)
        return <Text style={[homeScreenStyles.tickSeen, { color: theme.whatsappBlue }]}>✔✔</Text>;
      } else if (isDelivered) {
        // Grey double tick (delivered)
        return <Text style={[homeScreenStyles.tickDelivered, { color: theme.textTertiary }]}>✔✔</Text>;
      } else {
        // Single tick (sent)
        return <Text style={[homeScreenStyles.tickSent, { color: theme.textTertiary }]}>✔</Text>;
      }
    };

    return (
      <TouchableOpacity
        style={[homeScreenStyles.chatItem, { backgroundColor: theme.background, borderBottomColor: theme.border }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Avatar */}
        <View style={homeScreenStyles.avatarContainer}>
          {chat.isMetaAI ? (
            <MetaAIAvatar size={48} />
          ) : (
            (() => {
              // Check if user is unknown (phone number only, no saved name)
              const isUnknownUser = !isSelfChat && (
                !chat.otherUserName || 
                chat.otherUserName === 'Unknown' || 
                (chat.otherUserName.startsWith('+') && /^\+[0-9]+$/.test(chat.otherUserName))
              );
              
              if (isUnknownUser) {
                // Show unknown-user icon
                return (
                  <Image
                    source={require('../../../assets/icons/unknown-user.png')}
                    style={homeScreenStyles.unknownUserAvatar}
                    resizeMode="contain"
                  />
                );
              } else {
                // Show initials avatar
                return (
                  <View style={[homeScreenStyles.regularAvatar, { backgroundColor: theme.whatsappGreen }]}>
                    <Text style={[homeScreenStyles.avatarText, { color: theme.white }]}>
                      {isSelfChat ? 'M' : (chat.otherUserName?.charAt(0) || '?')}
                    </Text>
                  </View>
                );
              }
            })()
          )}
          {/* NO ONLINE INDICATOR - WhatsApp doesn't show it in chat list */}
        </View>

        {/* Chat Info */}
        <View style={homeScreenStyles.chatInfo}>
          <View style={homeScreenStyles.chatHeader}>
            <Text style={[homeScreenStyles.chatName, { color: theme.textPrimary }]} numberOfLines={1}>
              {chat.isMetaAI ? 'Meta AI' : (isSelfChat ? 'My Number (You)' : (chat.otherUserName || 'Unknown'))}
            </Text>
            {lastMessageTime && (
              <Text style={[homeScreenStyles.chatTime, { color: theme.textTertiary }]}>
                {formatTime(lastMessageTime)}
              </Text>
            )}
          </View>

          <View style={homeScreenStyles.messagePreview}>
            {renderTicks()}
            {isVoiceMessage && (
              <Image
                source={require('../../../assets/icons/voice-message.png')}
                style={[homeScreenStyles.voicePreviewIcon, { tintColor: theme.textSecondary }]}
                resizeMode="contain"
              />
            )}
            <Text style={[homeScreenStyles.messageText, { color: theme.textSecondary }]} numberOfLines={1}>
              {lastMessageText}
            </Text>
          </View>
        </View>

        {/* Unread Badge */}
        {unread > 0 && (
          <View style={[homeScreenStyles.unreadBadge, { backgroundColor: theme.unreadBadge }]}>
            <Text style={[homeScreenStyles.unreadCount, { color: theme.white }]}>{unread}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

/* -------------------- Encryption Notice -------------------- */
const EncryptionNotice = ({ theme }: { theme: any }) => (
  <View style={[homeScreenStyles.encryptionNotice, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
    <Text style={[homeScreenStyles.encryptionText, { color: theme.textSecondary }]}>
      🔒 Your personal messages are{' '}
      <Text style={[homeScreenStyles.encryptionHighlight, { color: theme.whatsappGreen }]}>
        end-to-end encrypted
      </Text>
    </Text>
  </View>
);

/* ==================== HomeScreen ==================== */
export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme, isDark } = useTheme();

  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);
  const [metaAIMessages, setMetaAIMessages] = useState<any[]>([]);

  // Get current user UID (handles both Firebase Auth and manual auth)
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

  /* 🔔 REGISTER FOR PUSH NOTIFICATIONS (STEP 11 FRONTEND) */
  useEffect(() => {
    if (currentUserUid) {
      registerForPushNotifications(currentUserUid);
    }
  }, [currentUserUid]);

  /* -------------------- Load Meta AI Messages -------------------- */
  const loadMetaAIMessages = useCallback(async () => {
    if (!currentUserUid) return;

    try {
      const stored = await AsyncStorage.getItem(`meta_ai_messages_${currentUserUid}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Firestore Timestamp objects
        const messagesWithTimestamps = parsed.map((msg: any) => {
          if (msg.createdAt && typeof msg.createdAt === 'object' && msg.createdAt.seconds) {
            msg.createdAt = firestore.Timestamp.fromMillis(msg.createdAt.seconds * 1000 + (msg.createdAt.nanoseconds || 0) / 1000000);
          } else if (msg.createdAt && typeof msg.createdAt === 'string') {
            msg.createdAt = firestore.Timestamp.fromDate(new Date(msg.createdAt));
          }
          return msg;
        });
        setMetaAIMessages(messagesWithTimestamps);
      } else {
        setMetaAIMessages([]);
      }
    } catch (error) {
      console.log('[HomeScreen] Error loading Meta AI messages:', error);
      setMetaAIMessages([]);
    }
  }, [currentUserUid]);

  useEffect(() => {
    loadMetaAIMessages();
  }, [loadMetaAIMessages]);

  // Reload Meta AI messages when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadMetaAIMessages();
    }, [loadMetaAIMessages])
  );

  /* -------------------- Firestore Listener (STEP 4 CORE) -------------------- */
  useEffect(() => {
    if (!currentUserUid) return;

    // Load cached chat rooms first for instant UI (WhatsApp-like behavior)
    const cacheKey = `chat_rooms_cache_${currentUserUid}`;
    AsyncStorage.getItem(cacheKey)
      .then(stored => {
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              console.log('[HomeScreen] Loaded cached chat rooms from AsyncStorage:', parsed.length);
              setChatRooms(parsed);
            }
          } catch (e) {
            console.log('[HomeScreen] Failed to parse cached chat rooms:', e);
          }
        }
      })
      .catch(err => {
        console.log('[HomeScreen] Error reading cached chat rooms:', err);
      });

    // Remove orderBy to avoid index requirement - we'll sort in memory instead
    const unsubscribe = firestore()
      .collection('chatRooms')
      .where('participants', 'array-contains', currentUserUid)
      .onSnapshot(async snapshot => {
        const rooms = await Promise.all(
          snapshot.docs.map(async doc => {
            const data = doc.data();
            const participants: string[] = data.participants || [];
            
            // Determine if self-chat
            const isSelfChat = participants.length === 1 && participants[0] === currentUserUid;
            
            // Get other user UID (or self for self-chat)
            const otherUserUid = isSelfChat 
              ? currentUserUid 
              : participants.find(uid => uid !== currentUserUid) || currentUserUid;
            
            // Get other user name
            let otherUserName = isSelfChat ? 'My Number (You)' : 'Unknown';
            if (!isSelfChat && otherUserUid) {
              try {
                const userData = await getUserData(otherUserUid);
                if (userData) {
                  // Try to get name from user data, fallback to phone number
                  otherUserName = (userData as any).displayName || userData.phoneNumber || 'Unknown';
                } else {
                  // If user not found, use phone number if it's the UID
                  otherUserName = otherUserUid;
                }
              } catch (error) {
                console.log('[HomeScreen] Error fetching user data:', error);
                otherUserName = otherUserUid;
              }
            }
            
            return {
              id: doc.id,
              ...data,
              otherUserName,
              isSelfChat,
            };
          })
        );
        
        // Filter out chats with no lastMessage (only show chats with at least one message)
        const roomsWithMessages = rooms.filter((room: any) => {
          // Check if lastMessage exists and has content
          // Also check if updatedAt or lastMessageAt exists (indicates activity)
          const hasLastMessage = room.lastMessage && (
            typeof room.lastMessage === 'string' ? room.lastMessage.trim() !== '' :
            room.lastMessage.text && room.lastMessage.text.trim() !== ''
          );
          
          const hasTimestamp = room.updatedAt || room.lastMessageAt || room.lastMessageTime;
          
          // Show if has message OR has timestamp (chat was created/updated)
          return hasLastMessage || hasTimestamp;
        });
        
        // Sort by updatedAt or lastMessageTime in memory (descending - most recent first)
        roomsWithMessages.sort((a: any, b: any) => {
          // Prefer updatedAt, fallback to lastMessageTime or lastMessageAt
          const getTime = (room: any) => {
            if (room.updatedAt?.toDate) return room.updatedAt.toDate().getTime();
            if (room.lastMessageAt?.toDate) return room.lastMessageAt.toDate().getTime();
            if (room.lastMessageTime?.toDate) return room.lastMessageTime.toDate().getTime();
            if (room.lastMessage?.timestamp?.toDate) return room.lastMessage.timestamp.toDate().getTime();
            return 0;
          };
          
          const timeA = getTime(a);
          const timeB = getTime(b);
          return timeB - timeA; // Descending order
        });
        
        console.log('[HomeScreen] Chat rooms loaded:', roomsWithMessages.length, 'rooms');
        console.log('[HomeScreen] Self-chat found:', roomsWithMessages.find((r: any) => r.isSelfChat) ? 'Yes' : 'No');
        
        // Check if Meta AI chat already exists in Firestore rooms
        const existingMetaAIChatIndex = roomsWithMessages.findIndex((room: any) => 
          room.chatType === 'META_AI' || room.id?.startsWith('meta_ai_chat_')
        );
        
        // Mark all chats and handle Meta AI
        let allChats = [...roomsWithMessages];
        
        if (existingMetaAIChatIndex !== -1) {
          // Use Firestore Meta AI chat (from backend)
          const existingMetaAIChat = allChats[existingMetaAIChatIndex] as any;
          existingMetaAIChat.isMetaAI = true;
          existingMetaAIChat.otherUserName = 'Meta AI';
        } else if (metaAIMessages.length > 0) {
          // Fallback: Use AsyncStorage Meta AI chat if no Firestore one exists
          const lastMessage = metaAIMessages[metaAIMessages.length - 1];
          const metaAIChat = {
            id: 'meta_ai_chat',
            otherUserName: 'Meta AI',
            lastMessage: typeof lastMessage === 'object' ? {
              text: lastMessage.text,
              senderId: lastMessage.senderId,
              timestamp: lastMessage.createdAt,
              seenBy: lastMessage.seenBy || [],
            } : lastMessage.text,
            lastMessageTime: lastMessage.createdAt,
            lastMessageAt: lastMessage.createdAt,
            updatedAt: lastMessage.createdAt,
            participants: [currentUserUid, 'meta_ai'],
            isMetaAI: true,
            isSelfChat: false,
          };
          allChats.push(metaAIChat);
        }
        
        // Re-sort with Meta AI included
        allChats.sort((a: any, b: any) => {
          const getTime = (room: any) => {
            if (room.updatedAt?.toDate) return room.updatedAt.toDate().getTime();
            if (room.lastMessageAt?.toDate) return room.lastMessageAt.toDate().getTime();
            if (room.lastMessageTime?.toDate) return room.lastMessageTime.toDate().getTime();
            if (room.lastMessage?.timestamp?.toDate) return room.lastMessage.timestamp.toDate().getTime();
            return 0;
          };
          
          const timeA = getTime(a);
          const timeB = getTime(b);
          return timeB - timeA; // Descending order
        });
        
        setChatRooms(allChats);

        // Update cache so next app launch can show chats instantly from storage
        AsyncStorage.setItem(cacheKey, JSON.stringify(allChats)).catch(err => {
          console.log('[HomeScreen] Error caching chat rooms:', err);
        });
      }, (error: any) => {
        console.error('[HomeScreen] Firestore listener error:', error);
        // If it's an index error, show helpful message
        if (error?.code === 'failed-precondition') {
          console.error('[HomeScreen] Firestore index required. The query will work without orderBy.');
        }
      });

    return () => unsubscribe();
  }, [currentUserUid, metaAIMessages]);

  /* -------------------- Search Filter -------------------- */
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) {
      return chatRooms;
    }
    
    const query = searchQuery.toLowerCase();
    return chatRooms.filter(chat => {
      // Extract last message text (handle both string and object formats)
      const lastMessageText = typeof chat.lastMessage === 'string' 
        ? chat.lastMessage 
        : chat.lastMessage?.text || '';
      
      // Also search in chat name
      const chatName = chat.otherUserName || '';
      
      return lastMessageText.toLowerCase().includes(query) ||
             chatName.toLowerCase().includes(query);
    });
  }, [chatRooms, searchQuery]);

  /* -------------------- Time Formatter -------------------- */
  const formatTime = useCallback((timestamp: any) => {
    if (!timestamp) return '';
    
    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else {
      return '';
    }
    
    const now = new Date();
    const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays < 1) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
    if (diffDays < 2) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }, []);

  /* -------------------- Navigation -------------------- */
  const handleChatPress = useCallback(
    (chatId: string, chat: any) => {
      navigation.navigate('ChatDetail', {
        chatId,
        chatName: chat.isMetaAI ? 'Meta AI' : (chat.otherUserName || 'Chat'),
      });
    },
    [navigation]
  );

  /* -------------------- UI -------------------- */
  return (
    <SafeAreaView style={[homeScreenStyles.container, { backgroundColor: theme.background }]}>
      <MenuBar visible={menuVisible} onClose={() => setMenuVisible(false)} />

      {/* Header */}
      <View style={[homeScreenStyles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <Text style={[homeScreenStyles.headerTitle, { color: isDark ? theme.textPrimary : theme.whatsappGreen }]}>WhatsApp</Text>
        <View style={homeScreenStyles.headerActions}>
          <TouchableOpacity style={homeScreenStyles.headerButton}>
            <Image
              source={require('../../../assets/icons/whatsapp-camera.png')}
              style={[homeScreenStyles.cameraIcon, { tintColor: theme.textPrimary }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={homeScreenStyles.headerButton}
            onPress={() => setMenuVisible(true)}
          >
            <Image
              source={require('../../../assets/icons/menu-bar.png')}
              style={[homeScreenStyles.moreIcon, { tintColor: theme.textPrimary }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={[homeScreenStyles.searchContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <View style={[homeScreenStyles.searchInputWrapper, { backgroundColor: theme.searchBackground }]}>
          <Image
            source={require('../../../assets/icons/search.png')}
            style={[homeScreenStyles.searchIcon, { tintColor: theme.iconGray }]}
            resizeMode="contain"
          />
          <TextInput
            style={[homeScreenStyles.searchInput, { color: theme.searchText }]}
            placeholder="Ask Meta AI or Search"
            placeholderTextColor={theme.searchPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Chat List */}
      <ScrollView style={[homeScreenStyles.chatList, { backgroundColor: theme.background }]}>
        {filteredChats.length === 0 ? (
          <>
            <View style={homeScreenStyles.placeholderView}>
              <Text style={[homeScreenStyles.placeholderText, { color: theme.textSecondary }]}>
                No chats available
              </Text>
            </View>
            <EncryptionNotice theme={theme} />
          </>
        ) : (
          <>
            {filteredChats.map(chat => (
              <ChatItem
                key={chat.id}
                chat={chat}
                currentUserUid={currentUserUid || ''}
                onPress={() => handleChatPress(chat.id, chat)}
                formatTime={formatTime}
                theme={theme}
              />
            ))}
            <EncryptionNotice theme={theme} />
          </>
        )}
      </ScrollView>

      {/* FAB */}
      <View style={homeScreenStyles.fabContainer}>
        {/* Meta AI Button */}
        <TouchableOpacity
          style={homeScreenStyles.metaAIFab}
          onPress={() => navigation.navigate('ChatDetail', {
            chatId: 'meta_ai_chat',
            chatName: 'Meta AI',
          })}
          activeOpacity={0.7}
        >
          <MetaAIAvatar size={48} />
        </TouchableOpacity>
        
        {/* New Chat Button */}
        <TouchableOpacity
          style={[homeScreenStyles.chatFab, { backgroundColor: theme.floatingButton }]}
          onPress={() => navigation.navigate('NewChat')}
        >
          <Text style={[homeScreenStyles.plusIcon, { color: theme.white }]}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
