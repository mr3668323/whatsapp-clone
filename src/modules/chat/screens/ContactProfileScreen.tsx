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
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

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

  const profileScreenStyles = {
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
      paddingTop: spacing.lg,
    },
    backButton: {
      padding: spacing.xs,
    },
    backIcon: {
      width: spacing.lg * 1.2,
      height: spacing.lg * 1.2,
      tintColor: colors.whatsappGreen,
    },
    headerTitle: {
      fontSize: typography.fontSize.xl,
      fontFamily: typography.fontFamily.bold,
      color: colors.textPrimary,
      marginLeft: spacing.md,
    },
    scrollView: {
      flex: 1,
      backgroundColor: colors.backgroundLight,
    },
    contentContainer: {
      paddingBottom: spacing.xl * 2,
    },
    avatarSection: {
      alignItems: 'center' as const,
      paddingVertical: spacing.xl * 2,
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    avatar: {
      width: spacing.avatarSize * 2,
      height: spacing.avatarSize * 2,
      borderRadius: spacing.avatarSize,
      backgroundColor: colors.whatsappGreen,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: spacing.md,
    },
    avatarText: {
      fontSize: typography.fontSize['4xl'],
      fontFamily: typography.fontFamily.bold,
      color: colors.white,
    },
    unknownUserAvatar: {
      width: spacing.avatarSize * 2,
      height: spacing.avatarSize * 2,
      borderRadius: spacing.avatarSize,
    },
    profileItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    profileItemIcon: {
      width: spacing['3xl'],
      height: spacing['3xl'],
      borderRadius: spacing.lg,
      backgroundColor: colors.backgroundGray,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: spacing.md,
    },
    profileItemIconText: {
      fontSize: typography.fontSize.lg,
      fontFamily: typography.fontFamily.regular,
      color: colors.iconGray,
    },
    profileItemContent: {
      flex: 1,
    },
    profileItemLabel: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    profileItemValue: {
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.regular,
      color: colors.textSecondary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.background,
    },
  };

  if (loading) {
    return (
      <SafeAreaView style={profileScreenStyles.container}>
        <View style={profileScreenStyles.header}>
          <TouchableOpacity onPress={handleBackPress} style={profileScreenStyles.backButton}>
            <Image
              source={require('../../../assets/icons/back.png')}
              style={profileScreenStyles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={profileScreenStyles.headerTitle}>Contact Info</Text>
        </View>
        <View style={profileScreenStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.whatsappGreen} />
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
    <SafeAreaView style={profileScreenStyles.container}>
      {/* Header */}
      <View style={profileScreenStyles.header}>
        <TouchableOpacity onPress={handleBackPress} style={profileScreenStyles.backButton}>
          <Image
            source={require('../../../assets/icons/back.png')}
            style={profileScreenStyles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={profileScreenStyles.headerTitle}>Contact Info</Text>
      </View>

      <ScrollView
        style={profileScreenStyles.scrollView}
        contentContainerStyle={profileScreenStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={profileScreenStyles.avatarSection}>
          <View style={profileScreenStyles.avatar}>
            {isUnknownUser ? (
              <Image
                source={require('../../../assets/icons/unknown-user.png')}
                style={profileScreenStyles.unknownUserAvatar}
                resizeMode="contain"
              />
            ) : (
              <Text style={profileScreenStyles.avatarText}>{avatarLetter}</Text>
            )}
          </View>
        </View>

        {/* Profile Items */}
        <View style={profileScreenStyles.profileItem}>
          <View style={profileScreenStyles.profileItemIcon}>
            <Text style={profileScreenStyles.profileItemIconText}>👤</Text>
          </View>
          <View style={profileScreenStyles.profileItemContent}>
            <Text style={profileScreenStyles.profileItemLabel}>Name</Text>
            <Text style={profileScreenStyles.profileItemValue}>{displayName}</Text>
          </View>
        </View>

        <View style={profileScreenStyles.profileItem}>
          <View style={profileScreenStyles.profileItemIcon}>
            <Text style={profileScreenStyles.profileItemIconText}>📞</Text>
          </View>
          <View style={profileScreenStyles.profileItemContent}>
            <Text style={profileScreenStyles.profileItemLabel}>Phone</Text>
            <Text style={profileScreenStyles.profileItemValue}>
              {phoneNumber || 'No phone number'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
