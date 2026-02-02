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
import { useTheme } from '../../../contexts/ThemeContext';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { theme, isDark } = useTheme();

  const settingsItems = [
    {
      section: null,
      items: [
        { id: '1', title: 'Account', subtitle: 'Security notifications, change number', iconSource: require('../../../assets/icons/accountSetting.png') },
        { id: '2', title: 'Privacy', subtitle: 'Block contacts, disappearing messages', iconSource: require('../../../assets/icons/privacySetting.png') },
        { id: '3', title: 'Avatar', subtitle: 'Create, edit, profile photo', iconSource: require('../../../assets/icons/AvatarSetting.png') },
        { id: '4', title: 'Lists', subtitle: 'Manage people and groups', iconSource: require('../../../assets/icons/ListsSetting.png') },
        { id: '5', title: 'Chats', subtitle: 'Theme, wallpapers, chat history', iconSource: require('../../../assets/icons/whatsapp-chat.png') },
        { id: '6', title: 'Broadcasts', subtitle: 'Manage lists and send broadcasts', iconSource: require('../../../assets/icons/broadcastSetting.png') },
        { id: '7', title: 'Notifications', subtitle: 'Message, group & call tones', iconSource: require('../../../assets/icons/notificationSetting.png') },
      ],
    },
    {
      section: null,
      items: [
        { id: '8', title: 'Storage and data', subtitle: 'Network usage, auto-download', iconSource: require('../../../assets/icons/StorageDataSetting.png') },
        { id: '9', title: 'Accessibility', subtitle: 'Increase contrast, animation', iconSource: require('../../../assets/icons/accessibilitySetting.png') },
        { id: '10', title: 'App language', subtitle: 'English (device\'s language)', iconSource: require('../../../assets/icons/AppLanguageSetting.png') },
      ],
    },
    {
      section: null,
      items: [
        { id: '11', title: 'Help and feedback', subtitle: 'Help center, contact us, privacy policy', iconSource: require('../../../assets/icons/HelpAndFeedbackSetting.png') },
        { id: '12', title: 'Invite a friend', iconSource: require('../../../assets/icons/InviteFriendSetting.png') },
      ],
    },
  ];

  const metaApps = [
    { id: '1', name: 'Meta AI', iconSource: require('../../../assets/icons/MetaCircleSetting.png') },
    { id: '2', name: 'Instagram', iconSource: require('../../../assets/icons/instagramSetting.png') },
    { id: '3', name: 'Facebook', iconSource: require('../../../assets/icons/facebookSetting.png') },
    { id: '4', name: 'Threads', iconSource: require('../../../assets/icons/threadsSetting.png') },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleItemPress = (title: string) => {
    if (title === 'Chats') {
      navigation.navigate('ChatsSettings');
    } else {
      console.log(`Pressed: ${title}`);
      // Navigation logic will go here
    }
  };

  return (
    <SafeAreaView style={[settingsScreenStyles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[settingsScreenStyles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={handleBackPress} style={settingsScreenStyles.backButton}>
          <Image
            source={require('../../../assets/icons/back.png')}
            style={[settingsScreenStyles.backIcon, { tintColor: theme.textPrimary }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <Text style={[settingsScreenStyles.headerTitle, { color: theme.textPrimary }]}>Settings</Text>
        
        <TouchableOpacity style={settingsScreenStyles.searchButton}>
          <Image
            source={require('../../../assets/icons/search.png')}
            style={[settingsScreenStyles.searchIcon, { tintColor: theme.iconGray }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={[settingsScreenStyles.scrollView, { backgroundColor: theme.backgroundLight }]}
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
                iconSource={item.iconSource}
                title={item.title}
                subtitle={item.subtitle}
                onPress={() => handleItemPress(item.title)}
              />
            ))}
          </View>
        ))}

        {/* Meta Section */}
        <View style={[settingsScreenStyles.metaSection, { backgroundColor: theme.background, borderTopColor: theme.border, borderBottomColor: theme.border }]}>
          <View style={settingsScreenStyles.metaHeader}>
            <Image
              source={require('../../../assets/icons/MetaSetting.png')}
              style={[settingsScreenStyles.metaLogoImage, { tintColor: isDark ? theme.iconGray : theme.textPrimary }]}
              resizeMode="contain"
            />
            <Text style={[settingsScreenStyles.metaTitle, { color: theme.textPrimary }]}>Meta</Text>
          </View>
          
          <TouchableOpacity 
            style={[settingsScreenStyles.metaCard, { borderTopColor: theme.border }]}
            onPress={() => handleItemPress('Accounts Centre')}
          >
            <View style={settingsScreenStyles.metaCardContent}>
              <Text style={[settingsScreenStyles.metaCardTitle, { color: theme.textPrimary }]}>Accounts Centre</Text>
              <Text style={[settingsScreenStyles.metaCardDescription, { color: theme.textSecondary }]}>
                Control your experience across WhatsApp, Facebook, Instagram and more.
              </Text>
            </View>
            <Text style={[settingsScreenStyles.chevronIcon, { color: theme.textTertiary }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Also from Meta */}
        <SectionHeader title="Also from Meta" marginTop={0} />
        <View style={[settingsScreenStyles.alsoFromMetaSection, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
          <View style={settingsScreenStyles.metaAppsRow}>
            {metaApps.map((app) => (
              <MetaAppIcon
                key={app.id}
                iconSource={app.iconSource}
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