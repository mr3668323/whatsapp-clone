import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types/navigation';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const loadPhoneNumber = async () => {
      try {
        const user = auth().currentUser;

        // Priority 1: Firebase Auth user (real Firebase Phone Auth)
        if (user) {
          console.log('[ProfileScreen] Firebase Auth user found, uid:', user.uid, 'phone:', user.phoneNumber);
          
          // Priority 1a: Firebase Auth phone number
          if (user.phoneNumber) {
            setPhoneNumber(user.phoneNumber);
            setLoading(false);
          }

          // Priority 1b: Firestore sync for Firebase Auth user
          unsubscribe = firestore()
            .collection('users')
            .doc(user.uid)
            .onSnapshot(
              doc => {
                if (doc.exists) {
                  const data = doc.data();
                  if (data?.phoneNumber) {
                    console.log('[ProfileScreen] Phone from Firestore:', data.phoneNumber);
                    setPhoneNumber(data.phoneNumber);
                  }
                }
                setLoading(false);
              },
              error => {
                console.log('[ProfileScreen] Firestore snapshot error:', error?.message);
                setLoading(false);
              }
            );

          return;
        }

        // Priority 2: Manual auth (test OTP - Firestore-only)
        const manualAuthPhone = await AsyncStorage.getItem('manualAuthPhoneNumber');
        if (manualAuthPhone) {
          console.log('[ProfileScreen] Manual auth detected, phone:', manualAuthPhone);
          setPhoneNumber(manualAuthPhone);
          
          // Also try to get from Firestore (uid = phoneNumber for test OTP users)
          unsubscribe = firestore()
            .collection('users')
            .doc(manualAuthPhone)
            .onSnapshot(
              doc => {
                if (doc.exists) {
                  const data = doc.data();
                  if (data?.phoneNumber) {
                    console.log('[ProfileScreen] Phone from Firestore (manual auth):', data.phoneNumber);
                    setPhoneNumber(data.phoneNumber);
                  }
                }
                setLoading(false);
              },
              error => {
                console.log('[ProfileScreen] Firestore snapshot error (manual auth):', error?.message);
                // If Firestore fails, still use the phone from AsyncStorage
                setLoading(false);
              }
            );

          return;
        }

        // No user found
        console.log('[ProfileScreen] No user found (neither Firebase Auth nor manual auth)');
        setLoading(false);
      } catch (error: any) {
        console.log('[ProfileScreen] Error loading phone number:', error?.message);
        setLoading(false);
      }
    };

    loadPhoneNumber();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Get display values
  const displayName = 'My Number';
  const displayPhone = phoneNumber ?? 'No phone number';
  const displayAbout = 'Set About';

  // Avatar shows "M" for "My Number"
  const avatarLetter = 'M';

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
      fontSize: typography.fontSize.xl,
      fontFamily: typography.fontFamily.regular,
      color: colors.whatsappTeal,
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
      backgroundColor: colors.whatsappTeal,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: spacing.md,
    },
    avatarText: {
      fontSize: typography.fontSize['4xl'],
      fontFamily: typography.fontFamily.bold,
      color: colors.white,
    },
    editText: {
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.regular,
      color: colors.whatsappTeal,
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
    profileItemValueLink: {
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.regular,
      color: colors.whatsappTeal,
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
            <Text style={profileScreenStyles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={profileScreenStyles.headerTitle}>Profile</Text>
        </View>
        <View style={profileScreenStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.whatsappTeal} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={profileScreenStyles.container}>
      {/* Header */}
      <View style={profileScreenStyles.header}>
        <TouchableOpacity onPress={handleBackPress} style={profileScreenStyles.backButton}>
          <Text style={profileScreenStyles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={profileScreenStyles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        style={profileScreenStyles.scrollView}
        contentContainerStyle={profileScreenStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={profileScreenStyles.avatarSection}>
          <View style={profileScreenStyles.avatar}>
            <Text style={profileScreenStyles.avatarText}>{avatarLetter}</Text>
          </View>
          <Text style={profileScreenStyles.editText}>Edit</Text>
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
            <Text style={profileScreenStyles.profileItemIconText}>ℹ️</Text>
          </View>
          <View style={profileScreenStyles.profileItemContent}>
            <Text style={profileScreenStyles.profileItemLabel}>About</Text>
            <Text style={profileScreenStyles.profileItemValueLink}>{displayAbout}</Text>
          </View>
        </View>

        <View style={profileScreenStyles.profileItem}>
          <View style={profileScreenStyles.profileItemIcon}>
            <Text style={profileScreenStyles.profileItemIconText}>📞</Text>
          </View>
          <View style={profileScreenStyles.profileItemContent}>
            <Text style={profileScreenStyles.profileItemLabel}>Phone</Text>
            <Text style={profileScreenStyles.profileItemValue}>{displayPhone}</Text>
          </View>
        </View>

        <View style={profileScreenStyles.profileItem}>
          <View style={profileScreenStyles.profileItemIcon}>
            <Text style={profileScreenStyles.profileItemIconText}>🔗</Text>
          </View>
          <View style={profileScreenStyles.profileItemContent}>
            <Text style={profileScreenStyles.profileItemLabel}>Links</Text>
            <Text style={profileScreenStyles.profileItemValueLink}>Add links</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
