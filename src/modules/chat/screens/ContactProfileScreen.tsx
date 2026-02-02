import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types/navigation';
import firestore from '@react-native-firebase/firestore';
import { getUserData } from '../../../services/userService';
import { useTheme } from '../../../contexts/ThemeContext';
import { contactProfileScreenStyles } from '../styles/ContactProfileScreen.styles';

type ContactProfileScreenRouteProp = {
  key: string;
  name: 'ContactProfile';
  params: {
    userId: string;
    userName?: string;
    phoneNumber?: string;
  };
};

type ContactProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ContactProfile'>;

export const ContactProfileScreen: React.FC = () => {
  const navigation = useNavigation<ContactProfileScreenNavigationProp>();
  const route = useRoute<ContactProfileScreenRouteProp>();
  const { theme } = useTheme();
  const { userId, userName: initialUserName, phoneNumber: initialPhoneNumber } = route.params;

  const [phoneNumber, setPhoneNumber] = useState<string | null>(initialPhoneNumber || null);
  const [displayName, setDisplayName] = useState<string>(initialUserName || 'Unknown');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContactData = async () => {
      try {
        setLoading(true);
        
        // Try to get user data from Firestore
        const userData = await getUserData(userId);
        
        if (userData) {
          // Priority 1: Firestore phoneNumber
          if (userData.phoneNumber) {
            setPhoneNumber(userData.phoneNumber);
          }
          
          // Priority 2: Firestore displayName
          if ((userData as any).displayName) {
            setDisplayName((userData as any).displayName);
          } else if (userData.phoneNumber) {
            setDisplayName(userData.phoneNumber);
          }
        } else {
          // If user not found in Firestore, check if userId is a phone number
          if (userId.startsWith('+')) {
            setPhoneNumber(userId);
            setDisplayName(userId);
          } else {
            // Fallback: use userId
            setPhoneNumber(userId);
            setDisplayName(userId);
          }
        }
      } catch (error: any) {
        console.error('[ContactProfileScreen] Error loading contact data:', error);
        // Fallback to route params or userId
        if (!phoneNumber) {
          setPhoneNumber(userId.startsWith('+') ? userId : userId);
        }
        if (displayName === 'Unknown' && !initialUserName) {
          setDisplayName(userId);
        }
      } finally {
        setLoading(false);
      }
    };

    loadContactData();
  }, [userId, initialUserName, initialPhoneNumber]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView style={[contactProfileScreenStyles.container, { backgroundColor: theme.background }]}>
        <View style={[contactProfileScreenStyles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={handleBackPress} style={contactProfileScreenStyles.backButton}>
            <Image
              source={require('../../../assets/icons/back.png')}
              style={[contactProfileScreenStyles.backIcon, { tintColor: theme.textPrimary }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={[contactProfileScreenStyles.headerTitle, { color: theme.textPrimary }]}>Contact Info</Text>
        </View>
        <View style={contactProfileScreenStyles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.whatsappGreen} />
        </View>
      </SafeAreaView>
    );
  }

  // Check if user is unknown (phone number only, no saved name)
  const isUnknownUser = !displayName || 
    displayName === 'Unknown' || 
    (displayName.startsWith('+') && /^\+[0-9]+$/.test(displayName)) ||
    (phoneNumber && displayName === phoneNumber);
  
  const avatarLetter = displayName?.charAt(0)?.toUpperCase() || '?';

  return (
    <SafeAreaView style={[contactProfileScreenStyles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[contactProfileScreenStyles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={handleBackPress} style={contactProfileScreenStyles.backButton}>
          <Image
            source={require('../../../assets/icons/back.png')}
            style={[contactProfileScreenStyles.backIcon, { tintColor: theme.textPrimary }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={[contactProfileScreenStyles.headerTitle, { color: theme.textPrimary }]}>Contact Info</Text>
      </View>

      <ScrollView
        style={[contactProfileScreenStyles.scrollView, { backgroundColor: theme.backgroundLight }]}
        contentContainerStyle={contactProfileScreenStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={contactProfileScreenStyles.avatarSection}>
          <View style={[contactProfileScreenStyles.avatar, { backgroundColor: theme.whatsappGreen }]}>
            {isUnknownUser ? (
              <Image
                source={require('../../../assets/icons/unknown-user.png')}
                style={contactProfileScreenStyles.unknownUserAvatar}
                resizeMode="contain"
              />
            ) : (
              <Text style={[contactProfileScreenStyles.avatarText, { color: theme.white }]}>{avatarLetter}</Text>
            )}
          </View>
        </View>

        {/* Profile Items */}
        <View style={[contactProfileScreenStyles.profileItem, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
          <View style={contactProfileScreenStyles.profileItemIcon}>
            <Text style={contactProfileScreenStyles.profileItemIconText}>👤</Text>
          </View>
          <View style={contactProfileScreenStyles.profileItemContent}>
            <Text style={[contactProfileScreenStyles.profileItemLabel, { color: theme.textSecondary }]}>Name</Text>
            <Text style={[contactProfileScreenStyles.profileItemValue, { color: theme.textPrimary }]}>{displayName}</Text>
          </View>
        </View>

        <View style={[contactProfileScreenStyles.profileItem, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
          <View style={contactProfileScreenStyles.profileItemIcon}>
            <Text style={contactProfileScreenStyles.profileItemIconText}>📞</Text>
          </View>
          <View style={contactProfileScreenStyles.profileItemContent}>
            <Text style={[contactProfileScreenStyles.profileItemLabel, { color: theme.textSecondary }]}>Phone</Text>
            <Text style={[contactProfileScreenStyles.profileItemValue, { color: theme.textPrimary }]}>
              {phoneNumber || 'No phone number'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
