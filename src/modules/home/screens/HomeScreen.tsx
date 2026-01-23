import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { homeScreenStyles } from '../styles/HomeScreen.styles';
import { colors } from '../../../styles/colors';
import type { RootStackParamList } from '../../../types/navigation';
import { MenuBar } from '../components/MenuBar';

// 🔔 ADD THIS IMPORT
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
  }: {
    chat: any;
    currentUserUid: string;
    onPress: () => void;
    formatTime: (timestamp: any) => string;
  }) => {
    const unread = chat.unreadCount?.[currentUserUid] || 0;

    return (
      <TouchableOpacity
        style={homeScreenStyles.chatItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Avatar */}
        <View style={homeScreenStyles.avatarContainer}>
          <View style={homeScreenStyles.regularAvatar}>
            <Text style={homeScreenStyles.avatarText}>
              {chat.otherUserName?.charAt(0) || '?'}
            </Text>
          </View>
        </View>

        {/* Chat Info */}
        <View style={homeScreenStyles.chatInfo}>
          <View style={homeScreenStyles.chatHeader}>
            <Text style={homeScreenStyles.chatName} numberOfLines={1}>
              {chat.otherUserName || 'Unknown'}
            </Text>
            <Text style={homeScreenStyles.chatTime}>
              {chat.lastMessageTime ? formatTime(chat.lastMessageTime) : ''}
            </Text>
          </View>

          <View style={homeScreenStyles.messagePreview}>
            <Text style={homeScreenStyles.messageText} numberOfLines={1}>
              {chat.lastMessage || 'No messages yet'}
            </Text>
          </View>
        </View>

        {/* Unread Badge */}
        {unread > 0 && (
          <View style={homeScreenStyles.unreadBadge}>
            <Text style={homeScreenStyles.unreadCount}>{unread}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

/* -------------------- Encryption Notice -------------------- */
const EncryptionNotice = () => (
  <View style={homeScreenStyles.encryptionNotice}>
    <Text style={homeScreenStyles.encryptionText}>
      🔒 Your personal messages are{' '}
      <Text style={homeScreenStyles.encryptionHighlight}>
        end-to-end encrypted
      </Text>
    </Text>
  </View>
);

/* ==================== HomeScreen ==================== */
export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const currentUserUid = auth().currentUser?.uid;

  /* 🔔 REGISTER FOR PUSH NOTIFICATIONS (STEP 11 FRONTEND) */
  useEffect(() => {
    if (currentUserUid) {
      registerForPushNotifications(currentUserUid);
    }
  }, [currentUserUid]);

  /* -------------------- Firestore Listener (STEP 4 CORE) -------------------- */
  useEffect(() => {
    if (!currentUserUid) return;

    const unsubscribe = firestore()
      .collection('chatRooms')
      .where('participants', 'array-contains', currentUserUid)
      .orderBy('lastMessageTime', 'desc')
      .onSnapshot(snapshot => {
        const rooms = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChatRooms(rooms);
      });

    return () => unsubscribe();
  }, [currentUserUid]);

  /* -------------------- Search Filter -------------------- */
  const filteredChats = useMemo(() => {
    return chatRooms.filter(chat =>
      (chat.lastMessage || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [chatRooms, searchQuery]);

  /* -------------------- Time Formatter -------------------- */
  const formatTime = useCallback((timestamp: any) => {
    const date = timestamp.toDate();
    const now = new Date();
    const diffDays =
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

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
        chatName: chat.otherUserName || 'Chat',
      });
    },
    [navigation]
  );

  /* -------------------- UI -------------------- */
  return (
    <SafeAreaView style={homeScreenStyles.container}>
      <MenuBar visible={menuVisible} onClose={() => setMenuVisible(false)} />

      {/* Header */}
      <View style={homeScreenStyles.header}>
        <Text style={homeScreenStyles.headerTitle}>WhatsApp</Text>
        <View style={homeScreenStyles.headerActions}>
          <TouchableOpacity style={homeScreenStyles.headerButton}>
            <Text style={homeScreenStyles.cameraIcon}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={homeScreenStyles.headerButton}
            onPress={() => setMenuVisible(true)}
          >
            <Text style={homeScreenStyles.moreIcon}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={homeScreenStyles.searchContainer}>
        <View style={homeScreenStyles.searchInputWrapper}>
          <Text style={homeScreenStyles.searchIcon}>🔍</Text>
          <TextInput
            style={homeScreenStyles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.searchPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Chat List */}
      <ScrollView style={homeScreenStyles.chatList}>
        {filteredChats.length === 0 ? (
          <>
            <View style={homeScreenStyles.placeholderView}>
              <Text style={homeScreenStyles.placeholderText}>
                No chats available
              </Text>
            </View>
            <EncryptionNotice />
          </>
        ) : (
          <>
            {filteredChats.map(chat => (
              <ChatItem
                key={chat.id}
                chat={chat}
                currentUserUid={currentUserUid!}
                onPress={() => handleChatPress(chat.id, chat)}
                formatTime={formatTime}
              />
            ))}
            <EncryptionNotice />
          </>
        )}
      </ScrollView>

      {/* FAB */}
      <View style={homeScreenStyles.fabContainer}>
        <TouchableOpacity
          style={homeScreenStyles.chatFab}
          onPress={() => navigation.navigate('NewChat')}
        >
          <Text style={homeScreenStyles.plusIcon}>+</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};
