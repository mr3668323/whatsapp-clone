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
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface UserData {
  phoneNumber?: string;
  name?: string;
  about?: string;
}

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authUser, setAuthUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Get current user from Firebase Auth
        const currentUser = auth().currentUser;
        setAuthUser(currentUser);

        if (currentUser?.uid) {
          // Fetch user document from Firestore
          const db = firestore();
          const userDoc = await db.collection('users').doc(currentUser.uid).get();
          
          const exists =
            typeof (userDoc as any).exists === 'function'
              ? !!(userDoc as any).exists()
              : !!(userDoc as any).exists;

          if (exists) {
            const data = userDoc.data() as UserData;
            setUserData(data);
            console.log('[ProfileScreen] ✅ User data loaded from Firestore');
          } else {
            console.log('[ProfileScreen] User document not found in Firestore, using Auth data');
            // Use phone from auth if Firestore doc doesn't exist
            setUserData({
              phoneNumber: currentUser.phoneNumber || undefined,
            });
          }
        }
      } catch (error: any) {
        console.log('[ProfileScreen] Error loading user data:', error?.message);
        // Fallback to auth user phone if error
        const currentUser = auth().currentUser;
        if (currentUser) {
          setUserData({
            phoneNumber: currentUser.phoneNumber || undefined,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Get display values
  const displayName = userData?.name || userData?.phoneNumber || authUser?.phoneNumber || 'Unknown';
  const displayPhone = userData?.phoneNumber || authUser?.phoneNumber || 'No phone number';
  const displayAbout = userData?.about || 'Set About';

  // Get first letter of name for avatar
  const avatarLetter = displayName.charAt(0).toUpperCase();

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
