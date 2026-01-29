import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { communitiesScreenStyles } from '../styles/CommunitiesScreen.styles';
import { CommunitiesMenuBar } from '../components/CommunitiesMenuBar';
import { colors } from '../../../styles/colors';

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  avatar: string;
  unreadCount: number;
}

const dummyCommunities: Community[] = [
  {
    id: '1',
    name: 'Tech Enthusiasts',
    description: 'Latest tech news and discussions',
    memberCount: 245,
    avatar: '💻',
    unreadCount: 3,
  },
  {
    id: '2',
    name: 'Fitness Group',
    description: 'Stay fit together! Share your workouts',
    memberCount: 189,
    avatar: '🏋️',
    unreadCount: 0,
  },
  {
    id: '3',
    name: 'Book Club',
    description: 'Monthly book discussions and reviews',
    memberCount: 156,
    avatar: '📚',
    unreadCount: 7,
  },
  {
    id: '4',
    name: 'Travel Buddies',
    description: 'Share travel tips and experiences',
    memberCount: 312,
    avatar: '✈️',
    unreadCount: 2,
  },
  {
    id: '5',
    name: 'Food Lovers',
    description: 'Recipes, restaurants, and food adventures',
    memberCount: 278,
    avatar: '🍕',
    unreadCount: 0,
  },
  {
    id: '6',
    name: 'Music Fans',
    description: 'Discover new music and share playlists',
    memberCount: 421,
    avatar: '🎵',
    unreadCount: 12,
  },
];

export const CommunitiesScreen: React.FC = () => {
  const [communities] = useState<Community[]>(dummyCommunities);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleCommunityPress = (communityId: string) => {
    console.log('Community pressed:', communityId);
  };

  const handleNewCommunity = () => {
    console.log('New community');
  };

  const renderCommunityItem = ({ item }: { item: Community }) => (
    <TouchableOpacity
      style={communitiesScreenStyles.communityCard}
      onPress={() => handleCommunityPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={communitiesScreenStyles.communityAvatar}>
        <Text style={communitiesScreenStyles.communityAvatarText}>{item.avatar}</Text>
      </View>
      <View style={communitiesScreenStyles.communityInfo}>
        <View style={communitiesScreenStyles.communityHeader}>
          <Text style={communitiesScreenStyles.communityName}>{item.name}</Text>
          {item.unreadCount > 0 && (
            <View style={communitiesScreenStyles.unreadBadge}>
              <Text style={communitiesScreenStyles.unreadBadgeText}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
        <Text style={communitiesScreenStyles.communityDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <Text style={communitiesScreenStyles.memberCount}>{item.memberCount} members</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={communitiesScreenStyles.container}>
      <StatusBar
        backgroundColor={colors.white}
        barStyle="dark-content"
      />
      
      {/* Menu Bar */}
      <CommunitiesMenuBar 
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
      
      {/* Header */}
      <View style={communitiesScreenStyles.header}>
        <Text style={communitiesScreenStyles.headerTitle}>Communities</Text>
        <TouchableOpacity 
          style={communitiesScreenStyles.headerButton} 
          onPress={() => setMenuVisible(true)}
        >
          <Image
            source={require('../../../assets/icons/menu-bar.png')}
            style={communitiesScreenStyles.menuIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={communitiesScreenStyles.infoSection}>
        <Text style={communitiesScreenStyles.infoText}>
          Stay connected with your communities. Create groups, share updates, and engage with members.
        </Text>
      </View>

      {/* Communities List */}
      <FlatList
        data={communities}
        renderItem={renderCommunityItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={communitiesScreenStyles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity 
        style={communitiesScreenStyles.fab} 
        onPress={handleNewCommunity} 
        activeOpacity={0.7}
      >
        <Text style={communitiesScreenStyles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};