import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  StatusBar,
} from 'react-native';
import { callsScreenStyles } from '../styles/CallsScreen.styles';
import { CallCard } from '../components/CallCard';
import { dummyCalls } from '../../../data/dummyCalls';
import { colors } from '../../../styles/colors';
import type { CallLog } from '../../../data/dummyCalls';

export const CallsScreen: React.FC = () => {
  const quickActions = [
    { id: '1', icon: '☎', label: 'Call' },
    { id: '2', icon: '📅', label: 'Schedule' },
    { id: '3', icon: '#️⃣', label: 'Keypad' },
    { id: '4', icon: '⭐', label: 'Favorites' },
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
    <SafeAreaView style={callsScreenStyles.container}>
      <StatusBar
        backgroundColor={colors.white}
        barStyle="dark-content"
      />
      
      {/* Header */}
      <View style={callsScreenStyles.header}>
        <Text style={callsScreenStyles.headerTitle}>Calls</Text>
        <View style={callsScreenStyles.headerActions}>
          <TouchableOpacity style={callsScreenStyles.headerButton}>
            <Text style={callsScreenStyles.searchIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={callsScreenStyles.headerButton}>
            <Text style={callsScreenStyles.menuIcon}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={callsScreenStyles.scrollView}>
        {/* Quick Action Row */}
        <View style={callsScreenStyles.quickActionsRow}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={callsScreenStyles.quickActionButton}
              onPress={() => handleQuickAction(action.label)}
              activeOpacity={0.7}
            >
              <View style={callsScreenStyles.quickActionIconContainer}>
                <Text style={callsScreenStyles.quickActionIcon}>{action.icon}</Text>
              </View>
              <Text style={callsScreenStyles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Section */}
        <View style={callsScreenStyles.sectionHeader}>
          <Text style={callsScreenStyles.sectionTitle}>Recent</Text>
        </View>

        {/* Calls List */}
        <FlatList
          data={dummyCalls}
          renderItem={renderCallItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />

        {/* Encryption Info */}
        <View style={callsScreenStyles.encryptionInfo}>
          <Text style={callsScreenStyles.lockIcon}>🔒</Text>
          <Text style={callsScreenStyles.encryptionText}>
            Your personal calls are{' '}
            <Text style={callsScreenStyles.encryptionHighlight}>
              end-to-end encrypted
            </Text>
          </Text>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={callsScreenStyles.fab}
        onPress={handleNewCall}
        activeOpacity={0.8}
      >
        <View style={callsScreenStyles.fabContent}>
          <Text style={callsScreenStyles.fabIcon}>☎</Text>
          <Text style={callsScreenStyles.fabPlus}>+</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};