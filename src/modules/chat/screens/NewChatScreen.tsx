import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';
import { newChatScreenStyles } from '../styles/NewChatScreen.styles';
import { getWhatsAppContacts, normalizePhoneNumberForMatch, WhatsAppContact } from '../../../services/contactService';
import { getUserByPhoneNumber } from '../../../services/userService';
import { getOrCreateChatRoom } from '../../../services/chatRoomService';
import type { RootStackParamList } from '../../../types/navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NewChatNavigation = NativeStackNavigationProp<RootStackParamList, 'NewChat'>;

interface DisplayContact extends WhatsAppContact {
  isSelf?: boolean;
}

export const NewChatScreen: React.FC = () => {
  const navigation = useNavigation<NewChatNavigation>();
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);
  const [currentUserPhone, setCurrentUserPhone] = useState<string | null>(null);

  // Get current user UID (handles both Firebase Auth and manual auth)
  useEffect(() => {
    const getCurrentUserUid = async () => {
      // Priority 1: Firebase Auth user
      const firebaseUser = auth().currentUser;
      if (firebaseUser?.uid) {
        console.log('[NewChatScreen] Firebase Auth user found, uid:', firebaseUser.uid);
        setCurrentUserUid(firebaseUser.uid);
        return;
      }

      // Priority 2: Manual auth (test OTP - Firestore-only)
      // For manual auth, the UID is the phone number stored in AsyncStorage
      const manualAuthPhone = await AsyncStorage.getItem('manualAuthPhoneNumber');
      if (manualAuthPhone) {
        console.log('[NewChatScreen] Manual auth detected, using phone as uid:', manualAuthPhone);
        setCurrentUserUid(manualAuthPhone);
        return;
      }

      // No user found
      console.log('[NewChatScreen] No user found (neither Firebase Auth nor manual auth)');
      setCurrentUserUid(null);
    };

    getCurrentUserUid();

    // Also listen to auth state changes
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser?.uid) {
        console.log('[NewChatScreen] Auth state changed, uid:', firebaseUser.uid);
        setCurrentUserUid(firebaseUser.uid);
      } else {
        // Check manual auth when Firebase user is null
        AsyncStorage.getItem('manualAuthPhoneNumber').then((manualAuthPhone) => {
          if (manualAuthPhone) {
            console.log('[NewChatScreen] Auth state changed to null, using manual auth uid:', manualAuthPhone);
            setCurrentUserUid(manualAuthPhone);
          } else {
            setCurrentUserUid(null);
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Debug: Log current user state
  useEffect(() => {
    console.log('[NewChatScreen] Component mounted/updated - currentUserUid:', currentUserUid, 'currentUserPhone:', currentUserPhone);
  }, [currentUserUid, currentUserPhone]);

  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Load phone number (same logic as ProfileScreen) - with immediate Firestore fetch
  useEffect(() => {
    if (!currentUserUid) {
      setCurrentUserPhone(null);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    const loadPhoneNumber = async () => {
      try {
        // Check if this is a Firebase Auth user or manual auth
        const firebaseUser = auth().currentUser;
        const isFirebaseAuth = firebaseUser?.uid === currentUserUid;

        if (isFirebaseAuth && firebaseUser) {
          console.log('[NewChatScreen] Loading phone for Firebase Auth user, uid:', firebaseUser.uid);
          
          // Priority 1a: Firebase Auth phone number (immediate)
          if (firebaseUser.phoneNumber) {
            console.log('[NewChatScreen] Phone from Firebase Auth:', firebaseUser.phoneNumber);
            setCurrentUserPhone(firebaseUser.phoneNumber);
          }

          // Priority 1b: Immediate Firestore fetch (don't wait for snapshot)
          try {
            const userDoc = await firestore()
              .collection('users')
              .doc(firebaseUser.uid)
              .get();
            
            const exists = typeof (userDoc as any).exists === 'function' 
              ? !!(userDoc as any).exists() 
              : !!(userDoc as any).exists;
            
            if (exists) {
              const data = userDoc.data();
              if (data?.phoneNumber) {
                console.log('[NewChatScreen] Phone from Firestore (immediate):', data.phoneNumber);
                setCurrentUserPhone(data.phoneNumber);
              }
            } else {
              console.log('[NewChatScreen] User document does not exist in Firestore yet');
            }
          } catch (firestoreError: any) {
            console.log('[NewChatScreen] Error fetching from Firestore:', firestoreError?.message);
          }

          // Priority 1c: Firestore real-time sync (for updates)
          unsubscribe = firestore()
            .collection('users')
            .doc(firebaseUser.uid)
            .onSnapshot(
              doc => {
                const exists = typeof (doc as any).exists === 'function' 
                  ? !!(doc as any).exists() 
                  : !!(doc as any).exists;
                if (exists) {
                  const data = doc.data();
                  if (data?.phoneNumber) {
                    console.log('[NewChatScreen] Phone from Firestore (realtime):', data.phoneNumber);
                    setCurrentUserPhone(data.phoneNumber);
                  }
                }
              },
              error => {
                console.log('[NewChatScreen] Firestore snapshot error:', error?.message);
              }
            );

          return;
        }

        // Priority 2: Manual auth (test OTP - Firestore-only)
        // For manual auth, currentUserUid is the phone number
        console.log('[NewChatScreen] Loading phone for manual auth user, uid (phone):', currentUserUid);
        setCurrentUserPhone(currentUserUid); // Use UID as phone for manual auth
        
        // Also try to get from Firestore immediately
        try {
          const userDoc = await firestore()
            .collection('users')
            .doc(currentUserUid)
            .get();
          
          const exists = typeof (userDoc as any).exists === 'function' 
            ? !!(userDoc as any).exists() 
            : !!(userDoc as any).exists;
          
          if (exists) {
            const data = userDoc.data();
            if (data?.phoneNumber) {
              console.log('[NewChatScreen] Phone from Firestore (manual auth, immediate):', data.phoneNumber);
              setCurrentUserPhone(data.phoneNumber);
            }
          }
        } catch (firestoreError: any) {
          console.log('[NewChatScreen] Error fetching from Firestore (manual auth):', firestoreError?.message);
        }
        
        // Real-time sync for manual auth
        unsubscribe = firestore()
          .collection('users')
          .doc(currentUserUid)
          .onSnapshot(
            doc => {
              const exists = typeof (doc as any).exists === 'function' 
                ? !!(doc as any).exists() 
                : !!(doc as any).exists;
              if (exists) {
                const data = doc.data();
                if (data?.phoneNumber) {
                  console.log('[NewChatScreen] Phone from Firestore (manual auth, realtime):', data.phoneNumber);
                  setCurrentUserPhone(data.phoneNumber);
                }
              }
            },
            error => {
              console.log('[NewChatScreen] Firestore snapshot error (manual auth):', error?.message);
            }
          );
      } catch (error) {
        console.log('[NewChatScreen] Error loading phone number:', error);
      }
    };

    loadPhoneNumber();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUserUid]);

  useEffect(() => {
    let isMounted = true;

    const loadContacts = async () => {
      if (!currentUserUid) {
        setLoadingContacts(false);
        return;
      }

      setLoadingContacts(true);
      const result = await getWhatsAppContacts(currentUserUid, currentUserPhone);
      if (!isMounted) return;

      setContacts(result.contacts);
      setPermissionDenied(result.permissionDenied);
      setLoadingContacts(false);
    };

    loadContacts();

    return () => {
      isMounted = false;
    };
  }, [currentUserUid, currentUserPhone]);

  const handleOpenChat = useCallback(
    async (target: { uid: string; name: string; phoneNumber: string }) => {
      if (!currentUserUid) {
        Alert.alert('Not authenticated', 'Please sign in again to start a chat.');
        return;
      }

      try {
        console.log('[NewChatScreen] Opening chat - currentUserUid:', currentUserUid, 'target.uid:', target.uid);
        const chatRoomId = await getOrCreateChatRoom(currentUserUid, target.uid);
        console.log('[NewChatScreen] Chat room created/found, chatRoomId:', chatRoomId);
        console.log('[NewChatScreen] Navigating to ChatDetail with chatId:', chatRoomId, 'chatName:', target.name || target.phoneNumber);
        
        navigation.navigate('ChatDetail', {
          chatId: chatRoomId,
          chatName: target.name || target.phoneNumber,
        });
      } catch (error: any) {
        console.error('[NewChatScreen] Error opening chat:', error);
        console.error('[NewChatScreen] Error details:', error?.message, error?.stack);
        console.error('[NewChatScreen] Error code:', error?.code);
        
        // Provide helpful error message for permission errors
        let errorMessage = error?.message || 'Unknown error';
        if (error?.code === 'permission-denied' || errorMessage.includes('permission-denied')) {
          errorMessage = 'Firestore permission denied.\n\n' +
            'Please deploy Firestore rules:\n' +
            '1. Open Firebase Console\n' +
            '2. Go to Firestore Database → Rules\n' +
            '3. Copy firestore.rules file contents\n' +
            '4. Paste and click "Publish"\n' +
            '5. Wait 10-20 seconds, then reload app';
        }
        
        Alert.alert('Error', `Failed to open chat: ${errorMessage}. Please try again.`);
      }
    },
    [currentUserUid, navigation]
  );

  const handleManualNumberChat = useCallback(
    async () => {
      if (!search.trim()) return;

      // Try multiple normalization approaches to find the user
      const searchInput = search.trim();
      
      // Try 1: Normalize with current user's phone context
      let normalized = normalizePhoneNumberForMatch(searchInput, currentUserPhone);
      
      // Try 2: If normalization failed, try the raw input (might already be in E.164)
      if (!normalized) {
        // Check if it's already in E.164 format
        if (searchInput.startsWith('+') && /^\+[1-9]\d{1,14}$/.test(searchInput)) {
          normalized = searchInput;
        } else {
          Alert.alert('Invalid number', 'Please enter a valid phone number.');
          return;
        }
      }

      console.log('[NewChatScreen] Searching for user with normalized phone:', normalized);
      
      // Try to find user by phone number
      let user = await getUserByPhoneNumber(normalized);
      
      // If not found, try without + prefix (some numbers might be stored without it)
      if (!user && normalized.startsWith('+')) {
        const withoutPlus = normalized.slice(1);
        console.log('[NewChatScreen] Trying without + prefix:', withoutPlus);
        user = await getUserByPhoneNumber(withoutPlus);
      }
      
      // If still not found, try with + prefix if we tried without it
      if (!user && !normalized.startsWith('+')) {
        const withPlus = '+' + normalized;
        console.log('[NewChatScreen] Trying with + prefix:', withPlus);
        user = await getUserByPhoneNumber(withPlus);
      }

      if (!user) {
        console.log('[NewChatScreen] User not found after all attempts, normalized:', normalized);
        Alert.alert('Not on WhatsApp', 'This number is not registered on WhatsApp.');
        return;
      }

      console.log('[NewChatScreen] User found, opening chat with uid:', user.uid);
      await handleOpenChat({
        uid: user.uid,
        name: user.phoneNumber,
        phoneNumber: user.phoneNumber,
      });
    },
    [search, currentUserPhone, handleOpenChat]
  );

  const selfContact: DisplayContact | null = useMemo(() => {
    // Show self-contact as long as we have a user UID (phone number can load later)
    if (!currentUserUid) {
      console.log('[NewChatScreen] No currentUserUid, selfContact is null');
      return null;
    }
    
    console.log('[NewChatScreen] Creating selfContact - uid:', currentUserUid, 'phone:', currentUserPhone || 'loading...');
    
    return {
      uid: currentUserUid,
      name: 'My Number (You)',
      phoneNumber: currentUserPhone || 'Loading...', // Use placeholder if phone not loaded yet
      isSelf: true,
    };
  }, [currentUserUid, currentUserPhone]);

  const filteredContacts: DisplayContact[] = useMemo(() => {
    const q = search.trim().toLowerCase();
    let base: DisplayContact[] = contacts.map(c => ({ ...c }));

    console.log('[NewChatScreen] filteredContacts - selfContact:', selfContact ? 'exists' : 'null', 'contacts:', base.length, 'search:', q);

    // Always include self-contact if it exists, regardless of search or loading state
    if (q.length > 0) {
      base = base.filter(c => {
        const byName = c.name.toLowerCase().includes(q);
        const byPhone = c.phoneNumber.replace(/\D/g, '').includes(q.replace(/\D/g, ''));
        return byName || byPhone;
      });
      
      // For self-contact, check if search matches
      if (selfContact) {
        const selfMatches = 
          selfContact.name.toLowerCase().includes(q) ||
          (selfContact.phoneNumber && selfContact.phoneNumber.replace(/\D/g, '').includes(q.replace(/\D/g, '')));
        if (selfMatches) {
          console.log('[NewChatScreen] Search matches self-contact, returning with selfContact first');
          return [selfContact, ...base];
        }
        // Even if search doesn't match, show self-contact first if no other results
        if (base.length === 0) {
          console.log('[NewChatScreen] No search results, showing selfContact anyway');
          return [selfContact];
        }
      }
      console.log('[NewChatScreen] Search active, selfContact not matching, returning base only');
      return base;
    }

    // No search: always show self-contact first
    if (selfContact) {
      const result = [selfContact, ...base];
      console.log('[NewChatScreen] No search, returning selfContact first, total items:', result.length);
      return result;
    }

    console.log('[NewChatScreen] No search, no selfContact, returning base only');
    return base;
  }, [contacts, search, selfContact]);

  const renderContact = ({ item }: { item: DisplayContact }) => {
    return (
      <TouchableOpacity
        style={newChatScreenStyles.contactItem}
        onPress={() =>
          handleOpenChat({
            uid: item.uid,
            name: item.name,
            phoneNumber: item.phoneNumber,
          })
        }
      >
        <View style={newChatScreenStyles.contactAvatar}>
          {(() => {
            // Check if user is unknown (name is phone number or missing)
            const isUnknownUser = !item.isSelf && (
              !item.name || 
              item.name === item.phoneNumber || 
              (item.name.startsWith('+') && /^\+[0-9]+$/.test(item.name))
            );
            
            if (isUnknownUser) {
              return (
                <Image
                  source={require('../../../assets/icons/unknown-user.png')}
                  style={newChatScreenStyles.unknownUserAvatar}
                  resizeMode="contain"
                />
              );
            } else {
              return (
                <Text style={newChatScreenStyles.contactAvatarText}>
                  {item.isSelf ? 'M' : (item.name || item.phoneNumber)[0]?.toUpperCase()}
                </Text>
              );
            }
          })()}
        </View>

        <View style={newChatScreenStyles.contactInfo}>
          <Text style={newChatScreenStyles.contactName}>
            {item.name}
          </Text>
          <Text style={newChatScreenStyles.contactSubtitle}>
            {item.isSelf ? 'Message yourself' : item.phoneNumber}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const showManualNumberRow = useMemo(() => {
    return search.trim().length > 0;
  }, [search]);

  return (
    <SafeAreaView style={newChatScreenStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header with back button */}
      <View style={newChatScreenStyles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={newChatScreenStyles.backButton}
          activeOpacity={0.7}
        >
          <Text style={newChatScreenStyles.backButtonText}>
            ←
          </Text>
        </TouchableOpacity>
        
        <Text style={newChatScreenStyles.headerTitle}>
          New chat
        </Text>
      </View>

      {/* Search bar */}
      <View style={newChatScreenStyles.searchContainer}>
        <View style={newChatScreenStyles.searchInputContainer}>
          <TextInput
            placeholder="Search name or number"
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            keyboardType="default"
            style={newChatScreenStyles.searchInput}
          />
        </View>
      </View>

      {/* Static options */}
      <View style={newChatScreenStyles.staticOptionsContainer}>
        {['New group', 'New contact', 'New community'].map(label => (
          <TouchableOpacity
            key={label}
            style={newChatScreenStyles.staticOption}
            activeOpacity={0.7}
          >
            <View style={newChatScreenStyles.staticOptionIcon}>
              <Text style={newChatScreenStyles.staticOptionIconText}>
                +
              </Text>
            </View>
            <Text style={newChatScreenStyles.staticOptionText}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Section title */}
      <View style={newChatScreenStyles.sectionTitleContainer}>
        <Text style={newChatScreenStyles.sectionTitle}>
          Contacts on WhatsApp
        </Text>
      </View>

      {permissionDenied && (
        <View style={newChatScreenStyles.permissionDeniedContainer}>
          <Text style={newChatScreenStyles.permissionDeniedText}>
            Contacts permission is denied. You can still start a chat by typing a full phone number above.
          </Text>
        </View>
      )}

      {/* Manual number row */}
      {showManualNumberRow && (
        <TouchableOpacity
          style={newChatScreenStyles.manualNumberRow}
          activeOpacity={0.7}
          onPress={handleManualNumberChat}
        >
          <View style={newChatScreenStyles.manualNumberIcon}>
            <Text style={newChatScreenStyles.manualNumberIconText}>
              #
            </Text>
          </View>
          <View style={newChatScreenStyles.manualNumberContent}>
            <Text style={newChatScreenStyles.manualNumberTitle}>
              Chat with {search.trim()}
            </Text>
            <Text style={newChatScreenStyles.manualNumberSubtitle}>
              Tap to start a chat by number
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Contacts list - Always show self-contact if available, even during loading */}
      {filteredContacts.length === 0 && selfContact ? (
        // If no contacts but selfContact exists, show it directly
        <View>
          {renderContact({ item: selfContact })}
          {loadingContacts && (
            <View style={newChatScreenStyles.emptyStateContainer}>
              <ActivityIndicator size="small" color={colors.whatsappGreen} />
              <Text style={newChatScreenStyles.loadingText}>
                Loading contacts...
              </Text>
            </View>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={item => item.uid}
          renderItem={renderContact}
          ListEmptyComponent={
            loadingContacts ? (
              <View style={newChatScreenStyles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.whatsappGreen} />
                <Text style={newChatScreenStyles.loadingText}>
                  Loading contacts...
                </Text>
              </View>
            ) : !currentUserUid ? (
              <View style={newChatScreenStyles.emptyStateContainer}>
                <Text style={newChatScreenStyles.emptyStateText}>
                  Please log in to start a chat
                </Text>
              </View>
            ) : (
              <View style={newChatScreenStyles.emptyStateContainer}>
                <Text style={newChatScreenStyles.emptyStateText}>
                  No contacts found
                </Text>
              </View>
            )
          }
          contentContainerStyle={
            filteredContacts.length === 0
              ? newChatScreenStyles.listContentContainerEmpty
              : newChatScreenStyles.listContentContainer
          }
          onLayout={() => {
            console.log('[NewChatScreen] FlatList rendered with', filteredContacts.length, 'items');
            console.log('[NewChatScreen] First item:', filteredContacts[0]?.name || 'none');
            console.log('[NewChatScreen] selfContact exists:', !!selfContact);
            console.log('[NewChatScreen] currentUserUid:', currentUserUid);
          }}
        />
      )}
    </SafeAreaView>
  );
};
