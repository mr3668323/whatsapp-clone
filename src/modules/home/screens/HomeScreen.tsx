import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { homeScreenStyles } from '../styles/HomeScreen.styles';
import { dummyChats } from '../../../data/dummyChats';
import { getUserChats } from '../../../services/chatService';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types/navigation';
// ADD THIS IMPORT
import { MenuBar } from '../components/MenuBar';

// Type for navigation
type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<{ Chats: undefined }>,
  NativeStackNavigationProp<RootStackParamList>
>;

// Move ChatItem component OUTSIDE HomeScreen
const ChatItem = React.memo(({ 
  chat, 
  isSelected, 
  onPress,
  formatTime 
}: { 
  chat: typeof dummyChats[0]; 
  isSelected: boolean; 
  onPress: () => void;
  formatTime: (timestamp: string) => string;
}) => (
  <TouchableOpacity
    style={[homeScreenStyles.chatItem, isSelected && homeScreenStyles.chatItemSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {/* Avatar */}
    <View style={homeScreenStyles.avatarContainer}>
      <View style={homeScreenStyles.regularAvatar}>
        <Text style={homeScreenStyles.avatarText}>{chat.avatar}</Text>
      </View>
      {chat.isOnline && <View style={homeScreenStyles.onlineIndicator} />}
    </View>

    {/* Chat Info */}
    <View style={homeScreenStyles.chatInfo}>
      <View style={homeScreenStyles.chatHeader}>
        <Text style={homeScreenStyles.chatName} numberOfLines={1}>
          {chat.name}
        </Text>
        <Text style={homeScreenStyles.chatTime}>{formatTime(chat.timestamp)}</Text>
      </View>
      <View style={homeScreenStyles.messagePreview}>
        <Text style={homeScreenStyles.messageText} numberOfLines={1}>
          {chat.lastMessage}
        </Text>
      </View>
    </View>

    {/* Unread Badge */}
    {chat.unreadCount > 0 && (
      <View style={homeScreenStyles.unreadBadge}>
        <Text style={homeScreenStyles.unreadCount}>{chat.unreadCount}</Text>
      </View>
    )}
  </TouchableOpacity>
));

// Move EncryptionNotice component OUTSIDE HomeScreen
const EncryptionNotice = () => (
  <View style={homeScreenStyles.encryptionNotice}>
    <Text style={homeScreenStyles.encryptionText}>
      🔒 Your personal messages are{' '}
      <Text style={homeScreenStyles.encryptionHighlight}>end-to-end encrypted</Text>
    </Text>
  </View>
);

export const HomeScreen = () => {
  // ALL HOOKS MUST BE AT THE TOP - NO CONDITIONAL HOOKS
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [chats, setChats] = useState<typeof dummyChats>(dummyChats);
  const [loadingChats, setLoadingChats] = useState(true);
  
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Load chats from Firestore when Firebase Auth user (uid) is available or manual auth
  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoadingChats(true);
        let userId: string | null = null;
        
        // Check Firebase Auth first
        const currentUser = auth().currentUser;
        if (currentUser?.uid) {
          userId = currentUser.uid;
          console.log('[HomeScreen] Firebase Auth user found, uid:', userId);
        } else {
          // Check manual auth (fallback mode)
          const manualAuthPhone = await AsyncStorage.getItem('manualAuthPhoneNumber');
          if (manualAuthPhone) {
            // For manual auth, use phone number as uid (matching what we created in Firestore)
            userId = manualAuthPhone;
            console.log('[HomeScreen] Manual auth detected, using phone as uid:', userId);
          }
        }

        if (userId) {
          const userChats = await getUserChats(userId);
          setChats(userChats as typeof dummyChats);
          console.log('[HomeScreen] ✅ Chats loaded from Firestore for uid:', userId, 'count:', userChats.length);
        } else {
          console.log('[HomeScreen] No authenticated user - using dummy chats');
          setChats(dummyChats);
        }
      } catch (error) {
        console.error('[HomeScreen] Error loading chats:', error);
        setChats(dummyChats);
      } finally {
        setLoadingChats(false);
      }
    };

    loadChats();
  }, []);

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    return chats.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chats, searchQuery]);

  // Format timestamp
  const formatTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Today - show time like "3:51 PM"
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      // Within a week - show day like "Mon"
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      // Older - show date like "Jan 12"
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }, []);

  const handleChatPress = useCallback((chatId: string, chatName: string) => {
    setSelectedChat(chatId);
    navigation.navigate('ChatDetail', { 
      chatId, 
      chatName 
    });
  }, [navigation]);

  const renderHeader = () => (
    <View style={homeScreenStyles.header}>
      <Text style={homeScreenStyles.headerTitle}>WhatsApp</Text>
      <View style={homeScreenStyles.headerActions}>
        <TouchableOpacity style={homeScreenStyles.headerButton} onPress={() => {}}>
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
  );

  const renderSearchBar = () => (
    <View style={homeScreenStyles.searchContainer}>
      <View style={homeScreenStyles.searchInputWrapper}>
        <Text style={homeScreenStyles.searchIcon}>🔍</Text>
        <TextInput
          style={homeScreenStyles.searchInput}
          placeholder="Ask Meta AI or Search"
          placeholderTextColor={colors.searchPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
      </View>
    </View>
  );

  const renderFloatingButtons = () => (
    <View style={homeScreenStyles.fabContainer}>
      <TouchableOpacity
        style={homeScreenStyles.chatFab}
        onPress={() => {}}
        activeOpacity={0.8}
      >
        <Text style={homeScreenStyles.plusIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (filteredChats.length === 0) {
      return (
        <View>
          <View style={homeScreenStyles.placeholderView}>
            <Text style={homeScreenStyles.placeholderText}>
              {searchQuery ? 'No chats found' : 'No chats available'}
            </Text>
          </View>
          <EncryptionNotice />
        </View>
      );
    }

    return (
      <>
        {filteredChats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isSelected={selectedChat === chat.id}
            onPress={() => handleChatPress(chat.id, chat.name)}
            formatTime={formatTime}
          />
        ))}
        <EncryptionNotice />
      </>
    );
  };

  // MAIN RENDER - this is the ONLY return statement
  return (
    <SafeAreaView style={homeScreenStyles.container}>
      <MenuBar 
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
      
      {renderHeader()}
      {renderSearchBar()}
      <ScrollView 
        style={homeScreenStyles.chatList}
        contentContainerStyle={homeScreenStyles.chatListContent}
      >
        {renderContent()}
      </ScrollView>
      {renderFloatingButtons()}
    </SafeAreaView>
  );
};