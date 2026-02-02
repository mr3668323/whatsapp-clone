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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types/navigation';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../contexts/ThemeContext';
import { profileScreenStyles } from '../styles/ProfileScreen.styles';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { theme } = useTheme();
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
                if (doc.exists()) {
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
                if (doc.exists()) {
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
      if (unsubscribe !== null) {
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

  if (loading) {
    return (
      <SafeAreaView style={[profileScreenStyles.container, { backgroundColor: theme.background }]}>
        <View style={[profileScreenStyles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={handleBackPress} style={profileScreenStyles.backButton}>
            <Image
              source={require('../../../assets/icons/back.png')}
              style={[profileScreenStyles.backIcon, { tintColor: theme.textPrimary }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={[profileScreenStyles.headerTitle, { color: theme.textPrimary }]}>Profile</Text>
        </View>
        <View style={profileScreenStyles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.whatsappGreen} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[profileScreenStyles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[profileScreenStyles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={handleBackPress} style={profileScreenStyles.backButton}>
          <Image
            source={require('../../../assets/icons/back.png')}
            style={[profileScreenStyles.backIcon, { tintColor: theme.textPrimary }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={[profileScreenStyles.headerTitle, { color: theme.textPrimary }]}>Profile</Text>
      </View>

      <ScrollView
        style={[profileScreenStyles.scrollView, { backgroundColor: theme.backgroundLight }]}
        contentContainerStyle={profileScreenStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={profileScreenStyles.avatarSection}>
          <View style={[profileScreenStyles.avatar, { backgroundColor: theme.whatsappGreen }]}>
            <Text style={[profileScreenStyles.avatarText, { color: theme.white }]}>{avatarLetter}</Text>
          </View>
          <Text style={[profileScreenStyles.editText, { color: theme.whatsappGreen }]}>Edit</Text>
        </View>

        {/* Profile Items */}
        <View style={[profileScreenStyles.profileItem, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
          <View style={profileScreenStyles.profileItemIcon}>
            <Text style={profileScreenStyles.profileItemIconText}>👤</Text>
          </View>
          <View style={profileScreenStyles.profileItemContent}>
            <Text style={[profileScreenStyles.profileItemLabel, { color: theme.textSecondary }]}>Name</Text>
            <Text style={[profileScreenStyles.profileItemValue, { color: theme.textPrimary }]}>{displayName}</Text>
          </View>
        </View>

        <View style={[profileScreenStyles.profileItem, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
          <View style={profileScreenStyles.profileItemIcon}>
            <Text style={profileScreenStyles.profileItemIconText}>ℹ️</Text>
          </View>
          <View style={profileScreenStyles.profileItemContent}>
            <Text style={[profileScreenStyles.profileItemLabel, { color: theme.textSecondary }]}>About</Text>
            <Text style={[profileScreenStyles.profileItemValueLink, { color: theme.textPrimary }]}>{displayAbout}</Text>
          </View>
        </View>

        <View style={[profileScreenStyles.profileItem, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
          <View style={profileScreenStyles.profileItemIcon}>
            <Text style={profileScreenStyles.profileItemIconText}>📞</Text>
          </View>
          <View style={profileScreenStyles.profileItemContent}>
            <Text style={[profileScreenStyles.profileItemLabel, { color: theme.textSecondary }]}>Phone</Text>
            <Text style={[profileScreenStyles.profileItemValue, { color: theme.textPrimary }]}>{displayPhone}</Text>
          </View>
        </View>

        <View style={[profileScreenStyles.profileItem, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
          <View style={profileScreenStyles.profileItemIcon}>
            <Text style={profileScreenStyles.profileItemIconText}>🔗</Text>
          </View>
          <View style={profileScreenStyles.profileItemContent}>
            <Text style={[profileScreenStyles.profileItemLabel, { color: theme.textSecondary }]}>Links</Text>
            <Text style={[profileScreenStyles.profileItemValueLink, { color: theme.textPrimary }]}>Add links</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
