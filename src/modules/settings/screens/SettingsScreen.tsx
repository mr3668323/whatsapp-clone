import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Image,
} from 'react-native';
import { settingsScreenStyles } from '../styles/SettingsScreen.styles';
import { SettingsItem } from '../components/SettingsItem';
import { SectionHeader } from '../components/SectionHeader';
import { ProfileHeader } from '../components/ProfileHeader';
import { MetaAppIcon } from '../components/MetaAppIcon';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types/navigation';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const settingsItems = [
    {
      section: null,
      items: [
        { id: '1', title: 'Account', subtitle: 'Security notifications, change number', icon: '🔐' },
        { id: '2', title: 'Privacy', subtitle: 'Block contacts, disappearing messages', icon: '🔒' },
        { id: '3', title: 'Avatar', subtitle: 'Create, edit, profile photo', icon: '👤' },
        { id: '4', title: 'Lists', subtitle: 'Manage people and groups', icon: '📋' },
        { id: '5', title: 'Chats', subtitle: 'Theme, wallpapers, chat history', icon: '💬' },
        { id: '6', title: 'Broadcasts', subtitle: 'Manage lists and send broadcasts', icon: '📢' },
        { id: '7', title: 'Notifications', subtitle: 'Message, group & call tones', icon: '🔔' },
      ],
    },
    {
      section: null,
      items: [
        { id: '8', title: 'Storage and data', subtitle: 'Network usage, auto-download', icon: '📦' },
        { id: '9', title: 'Accessibility', subtitle: 'Increase contrast, animation', icon: '♿' },
        { id: '10', title: 'App language', subtitle: 'English (device\'s language)', icon: '🌐' },
      ],
    },
    {
      section: null,
      items: [
        { id: '11', title: 'Help and feedback', subtitle: 'Help center, contact us, privacy policy', icon: '❓' },
        { id: '12', title: 'Invite a friend', icon: '👥' },
      ],
    },
  ];

  const metaApps = [
    { id: '1', name: 'Meta AI', icon: '⭕' },
    { id: '2', name: 'Instagram', icon: '📷' },
    { id: '3', name: 'Facebook', icon: 'f' },
    { id: '4', name: 'Threads', icon: '𝓣' },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleItemPress = (title: string) => {
    console.log(`Pressed: ${title}`);
    // Navigation logic will go here
  };

  return (
    <SafeAreaView style={settingsScreenStyles.container}>
      {/* Header */}
      <View style={settingsScreenStyles.header}>
        <TouchableOpacity onPress={handleBackPress} style={settingsScreenStyles.backButton}>
          <Image
            source={require('../../../assets/icons/back.png')}
            style={settingsScreenStyles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <Text style={settingsScreenStyles.headerTitle}>Settings</Text>
        
        <TouchableOpacity style={settingsScreenStyles.searchButton}>
          <Image
            source={require('../../../assets/icons/search.png')}
            style={settingsScreenStyles.searchIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={settingsScreenStyles.scrollView}
        contentContainerStyle={settingsScreenStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <ProfileHeader onPress={() => navigation.navigate('Profile')} />

        {/* Settings Items */}
        {settingsItems.map((section, sectionIndex) => (
          <View key={`section-${sectionIndex}`}>
            {section.items.map((item) => (
              <SettingsItem
                key={item.id}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                onPress={() => handleItemPress(item.title)}
              />
            ))}
          </View>
        ))}

        {/* Meta Section */}
        <View style={settingsScreenStyles.metaSection}>
          <View style={settingsScreenStyles.metaHeader}>
            <Text style={settingsScreenStyles.metaLogo}>∞</Text>
            <Text style={settingsScreenStyles.metaTitle}>Meta</Text>
          </View>
          
          <TouchableOpacity 
            style={settingsScreenStyles.metaCard}
            onPress={() => handleItemPress('Accounts Centre')}
          >
            <View style={settingsScreenStyles.metaCardContent}>
              <Text style={settingsScreenStyles.metaCardTitle}>Accounts Centre</Text>
              <Text style={settingsScreenStyles.metaCardDescription}>
                Control your experience across WhatsApp, Facebook, Instagram and more.
              </Text>
            </View>
            <Text style={settingsScreenStyles.chevronIcon}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Also from Meta */}
        <SectionHeader title="Also from Meta" marginTop={0} />
        <View style={settingsScreenStyles.alsoFromMetaSection}>
          <View style={settingsScreenStyles.metaAppsRow}>
            {metaApps.map((app) => (
              <MetaAppIcon
                key={app.id}
                icon={app.icon}
                name={app.name}
                onPress={() => handleItemPress(app.name)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};