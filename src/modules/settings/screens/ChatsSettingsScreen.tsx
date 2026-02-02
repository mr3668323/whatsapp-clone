import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types/navigation';
import { useTheme } from '../../../contexts/ThemeContext';
import { chatsSettingsScreenStyles } from '../styles/ChatsSettingsScreen.styles';
import { SectionHeader } from '../components/SectionHeader';
import { ThemePickerModal } from '../components/ThemePickerModal';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { FontSizePicker } from '../components/FontSizePicker';
import { spacing } from '../../../styles/spacing';

type ChatsSettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type FontSize = 'small' | 'medium' | 'large';

export const ChatsSettingsScreen: React.FC = () => {
  const navigation = useNavigation<ChatsSettingsScreenNavigationProp>();
  const { themeMode, theme, isDark } = useTheme();
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [enterToSend, setEnterToSend] = useState(false);
  const [mediaVisibility, setMediaVisibility] = useState(true);
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [keepArchived, setKeepArchived] = useState(true);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const getThemeDisplayName = (): string => {
    switch (themeMode) {
      case 'system':
        return 'System default';
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      default:
        return 'System default';
    }
  };

  const handleThemePress = () => {
    setIsThemeModalVisible(true);
  };

  const handleThemeSelected = () => {
    setIsThemeModalVisible(false);
  };

  return (
    <SafeAreaView style={[chatsSettingsScreenStyles.container, { backgroundColor: theme.backgroundLight }]}>
      {/* Header */}
      <View style={[chatsSettingsScreenStyles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={handleBackPress} style={chatsSettingsScreenStyles.backButton}>
          <Image
            source={require('../../../assets/icons/back.png')}
            style={[chatsSettingsScreenStyles.backIcon, { tintColor: theme.textPrimary }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <Text style={[chatsSettingsScreenStyles.headerTitle, { color: theme.textPrimary }]}>Chats</Text>
        
        <View style={chatsSettingsScreenStyles.searchButton} />
      </View>

      <ScrollView 
        style={[chatsSettingsScreenStyles.scrollView, { backgroundColor: theme.backgroundLight }]}
        contentContainerStyle={chatsSettingsScreenStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Display Section */}
        <View style={[chatsSettingsScreenStyles.section, { backgroundColor: theme.background, marginTop: spacing.md }]}>
          <SectionHeader title="Display" marginTop={0} />
          
          {/* Theme Setting */}
          <TouchableOpacity
            style={[chatsSettingsScreenStyles.settingRow, { borderBottomColor: theme.border }]}
            onPress={handleThemePress}
            activeOpacity={0.7}
          >
            <View style={[chatsSettingsScreenStyles.settingIconContainer, { backgroundColor: theme.backgroundGray }]}>
              <Image
                source={require('../../../assets/icons/themeChats.png')}
                style={[chatsSettingsScreenStyles.settingIconImage, { tintColor: isDark ? theme.iconGray : theme.textPrimary }]}
                resizeMode="contain"
              />
            </View>
            <View style={chatsSettingsScreenStyles.settingContent}>
              <Text style={[chatsSettingsScreenStyles.settingTitle, { color: theme.textPrimary }]}>Theme</Text>
              <Text style={[chatsSettingsScreenStyles.settingSubtitle, { color: theme.textSecondary }]}>
                {getThemeDisplayName()}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Default Chat Theme */}
          <TouchableOpacity
            style={[chatsSettingsScreenStyles.settingRowIcon, { borderBottomWidth: 1, borderBottomColor: theme.border }]}
            activeOpacity={0.7}
            onPress={() => {
              // Placeholder navigation - non-functional as per WhatsApp
            }}
          >
            <View style={[chatsSettingsScreenStyles.settingIconContainer, { backgroundColor: theme.backgroundGray }]}>
              <Image
                source={require('../../../assets/icons/DefaultChatTheme.png')}
                style={[chatsSettingsScreenStyles.settingIconImage, { tintColor: isDark ? theme.iconGray : theme.textPrimary }]}
                resizeMode="contain"
              />
            </View>
            <View style={chatsSettingsScreenStyles.settingContent}>
              <Text style={[chatsSettingsScreenStyles.settingTitleNoSubtitle, { color: theme.textPrimary }]}>Default chat theme</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Chat Settings Section */}
        <View style={[chatsSettingsScreenStyles.section, { backgroundColor: theme.background, marginTop: spacing.md }]}>
          <SectionHeader title="Chat settings" marginTop={0} />
          
          {/* Enter is send */}
          <View style={[chatsSettingsScreenStyles.settingRow, { borderBottomColor: theme.border }]}>
            <View style={chatsSettingsScreenStyles.settingContent}>
              <Text style={[chatsSettingsScreenStyles.settingTitle, { color: theme.textPrimary }]}>Enter is send</Text>
              <Text style={[chatsSettingsScreenStyles.settingSubtitle, { color: theme.textSecondary }]}>
                Enter key will send your message
              </Text>
            </View>
            <ToggleSwitch value={enterToSend} onValueChange={setEnterToSend} />
          </View>

          {/* Media Visibility */}
          <View style={[chatsSettingsScreenStyles.settingRow, { borderBottomColor: theme.border }]}>
            <View style={chatsSettingsScreenStyles.settingContent}>
              <Text style={[chatsSettingsScreenStyles.settingTitle, { color: theme.textPrimary }]}>Media visibility</Text>
              <Text style={[chatsSettingsScreenStyles.settingSubtitle, { color: theme.textSecondary }]}>
                Show newly downloaded media in your device's gallery
              </Text>
            </View>
            <ToggleSwitch value={mediaVisibility} onValueChange={setMediaVisibility} />
          </View>

          {/* Font Size */}
          <View style={[chatsSettingsScreenStyles.settingRow, { borderBottomColor: theme.border }]}>
            <View style={chatsSettingsScreenStyles.settingContent}>
              <Text style={[chatsSettingsScreenStyles.settingTitle, { color: theme.textPrimary }]}>Font size</Text>
              <Text style={[chatsSettingsScreenStyles.settingSubtitle, { color: theme.textSecondary }]}>
                {fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}
              </Text>
            </View>
            <FontSizePicker value={fontSize} onValueChange={setFontSize} />
          </View>

          {/* Voice Message Transcripts */}
          <View style={[chatsSettingsScreenStyles.settingRow, { borderBottomColor: theme.border }]}>
            <View style={chatsSettingsScreenStyles.settingContent}>
              <Text style={[chatsSettingsScreenStyles.settingTitle, { color: theme.textPrimary }]}>Voice message transcripts</Text>
              <Text style={[chatsSettingsScreenStyles.settingSubtitle, { color: theme.textSecondary }]}>
                Read new voice messages.
              </Text>
            </View>
          </View>
        </View>

        {/* Archived Chats Section */}
        <View style={[chatsSettingsScreenStyles.section, { backgroundColor: theme.background, marginTop: spacing.md }]}>
          <SectionHeader title="Archived chats" marginTop={0} />
          
          {/* Keep Chats Archived */}
          <View style={[chatsSettingsScreenStyles.settingRow, { borderBottomColor: theme.border }]}>
            <View style={chatsSettingsScreenStyles.settingContent}>
              <Text style={[chatsSettingsScreenStyles.settingTitle, { color: theme.textPrimary }]}>Keep chats archived</Text>
              <Text style={[chatsSettingsScreenStyles.settingSubtitle, { color: theme.textSecondary }]}>
                Archived chats will remain archived when you receive a new message.
              </Text>
            </View>
            <ToggleSwitch value={keepArchived} onValueChange={setKeepArchived} />
          </View>

          {/* Chat Backup */}
          <TouchableOpacity
            style={chatsSettingsScreenStyles.settingRowIcon}
            activeOpacity={0.7}
            onPress={() => {
              // Placeholder navigation - ready for implementation
            }}
          >
            <View style={[chatsSettingsScreenStyles.settingIconContainer, { backgroundColor: theme.backgroundGray }]}>
              <Image
                source={require('../../../assets/icons/ChatBackup.png')}
                style={[chatsSettingsScreenStyles.settingIconImage, { tintColor: isDark ? theme.iconGray : theme.textPrimary }]}
                resizeMode="contain"
              />
            </View>
            <View style={chatsSettingsScreenStyles.settingContent}>
              <Text style={[chatsSettingsScreenStyles.settingTitleNoSubtitle, { color: theme.textPrimary }]}>Chat backup</Text>
            </View>
          </TouchableOpacity>

          {/* Transfer Chats */}
          <TouchableOpacity
            style={chatsSettingsScreenStyles.settingRowIcon}
            activeOpacity={0.7}
            onPress={() => {
              // Placeholder navigation - ready for implementation
            }}
          >
            <View style={[chatsSettingsScreenStyles.settingIconContainer, { backgroundColor: theme.backgroundGray }]}>
              <Image
                source={require('../../../assets/icons/TransferChats.png')}
                style={[chatsSettingsScreenStyles.settingIconImage, { tintColor: isDark ? theme.iconGray : theme.textPrimary }]}
                resizeMode="contain"
              />
            </View>
            <View style={chatsSettingsScreenStyles.settingContent}>
              <Text style={[chatsSettingsScreenStyles.settingTitleNoSubtitle, { color: theme.textPrimary }]}>Transfer chats</Text>
            </View>
          </TouchableOpacity>

          {/* Chat History */}
          <TouchableOpacity
            style={chatsSettingsScreenStyles.settingRowIcon}
            activeOpacity={0.7}
            onPress={() => {
              // Placeholder navigation - ready for implementation
            }}
          >
            <View style={[chatsSettingsScreenStyles.settingIconContainer, { backgroundColor: theme.backgroundGray }]}>
              <Image
                source={require('../../../assets/icons/ChatHistory.png')}
                style={[chatsSettingsScreenStyles.settingIconImage, { tintColor: isDark ? theme.iconGray : theme.textPrimary }]}
                resizeMode="contain"
              />
            </View>
            <View style={chatsSettingsScreenStyles.settingContent}>
              <Text style={[chatsSettingsScreenStyles.settingTitleNoSubtitle, { color: theme.textPrimary }]}>Chat history</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Theme Picker Modal */}
      <ThemePickerModal
        visible={isThemeModalVisible}
        currentTheme={themeMode}
        onClose={() => setIsThemeModalVisible(false)}
        onSelect={handleThemeSelected}
      />
    </SafeAreaView>
  );
};
