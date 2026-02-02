import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  StatusBar,
  Image,
} from 'react-native';
import { callsScreenStyles } from '../styles/CallsScreen.styles';
import { CallCard } from '../components/CallCard';
import { dummyCalls } from '../../../data/dummyCalls';
import { useTheme } from '../../../contexts/ThemeContext';
import type { CallLog } from '../../../data/dummyCalls';

export const CallsScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const quickActions = [
    {
      id: 'call',
      label: 'Call',
      icon: require('../../../assets/icons/whatsapp-calls.png'),
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: require('../../../assets/icons/schedule.png'),
    },
    {
      id: 'keypad',
      label: 'Keypad',
      icon: require('../../../assets/icons/keypad.png'),
    },
    {
      id: 'favourite',
      label: 'Favorites',
      icon: require('../../../assets/icons/favourite.png'),
    },
  ];

  const handleCallPress = (callId: string) => {
    console.log('Call details:', callId);
  };

  const handleVideoPress = (callId: string) => {
    console.log('Video call to:', callId);
  };

  const handleAudioPress = (callId: string) => {
    console.log('Audio call to:', callId);
  };

  const handleQuickAction = (action: string) => {
    console.log('Quick action:', action);
  };

  const handleNewCall = () => {
    console.log('New call FAB pressed');
  };

  const renderCallItem = ({ item }: { item: CallLog }) => (
    <CallCard
      call={item}
      onPress={() => handleCallPress(item.id)}
      onVideoPress={() => handleVideoPress(item.id)}
      onAudioPress={() => handleAudioPress(item.id)}
    />
  );

  return (
    <SafeAreaView style={[callsScreenStyles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      
      {/* Header */}
      <View style={[callsScreenStyles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <Text style={[callsScreenStyles.headerTitle, { color: theme.textPrimary }]}>Calls</Text>
        <View style={callsScreenStyles.headerActions}>
          <TouchableOpacity style={callsScreenStyles.headerButton}>
            <Image
              source={require('../../../assets/icons/search.png')}
              style={[callsScreenStyles.searchIcon, { tintColor: theme.textPrimary }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={callsScreenStyles.headerButton}>
            <Image
              source={require('../../../assets/icons/menu-bar.png')}
              style={[callsScreenStyles.menuIcon, { tintColor: theme.textPrimary }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={[callsScreenStyles.scrollView, { backgroundColor: theme.background }]}>
        {/* Quick Action Row */}
        <View style={[callsScreenStyles.quickActionsRow, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={callsScreenStyles.quickActionButton}
              onPress={() => handleQuickAction(action.label)}
              activeOpacity={0.7}
            >
              <View style={[callsScreenStyles.quickActionIconContainer, { backgroundColor: theme.backgroundInput }]}>
                <Image
                  source={action.icon}
                  style={[callsScreenStyles.quickActionIcon, { tintColor: theme.iconGray }]}
                  resizeMode="contain"
                />
              </View>
              <Text style={[callsScreenStyles.quickActionLabel, { color: theme.textPrimary }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Section */}
        <View style={[callsScreenStyles.sectionHeader, { backgroundColor: theme.backgroundLight }]}>
          <Text style={[callsScreenStyles.sectionTitle, { color: theme.textSecondary }]}>Recent</Text>
        </View>

        {/* Calls List */}
        <FlatList
          data={dummyCalls}
          renderItem={renderCallItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />

        {/* Encryption Info */}
        <View style={[callsScreenStyles.encryptionInfo, { backgroundColor: theme.background }]}>
          <Text style={callsScreenStyles.lockIcon}>🔒</Text>
          <Text style={[callsScreenStyles.encryptionText, { color: theme.textSecondary }]}>
            Your personal calls are{' '}
            <Text style={[callsScreenStyles.encryptionHighlight, { color: theme.whatsappGreen }]}>
              end-to-end encrypted
            </Text>
          </Text>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[callsScreenStyles.fab, { backgroundColor: theme.floatingButton }]}
        onPress={handleNewCall}
        activeOpacity={0.8}
      >
        <Image
          source={require('../../../assets/icons/new-call.png')}
          style={[callsScreenStyles.fabIconImage, { tintColor: theme.white }]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};