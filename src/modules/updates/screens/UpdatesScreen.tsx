import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  TextInput,
  Animated,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { updatesScreenStyles } from '../styles/UpdatesScreen.styles';
import { useTheme } from '../../../contexts/ThemeContext';
import { dummyStatuses, dummyChannels } from '../../../data/dummyUpdates';

// Import navigation hooks
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';

export const UpdatesScreen: React.FC = () => {
  // Get navigation prop
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme, isDark } = useTheme();
  
  // Dropdown state
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  
  // Search state
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStatuses, setFilteredStatuses] = useState(dummyStatuses);
  const [filteredChannels, setFilteredChannels] = useState(dummyChannels);

  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const searchAnimation = useRef(new Animated.Value(0)).current;

  // Dropdown menu items
  const menuItems = [
    'New group',
    'New community',
    'Broadcast lists',
    'Linked devices',
    'Starred',
    'Read all',
    'Settings',
  ];

  // Toggle dropdown with animation
  const toggleDropdown = () => {
    if (isDropdownVisible) {
      Animated.timing(dropdownAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsDropdownVisible(false));
    } else {
      setIsDropdownVisible(true);
      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  // Close dropdown
  const closeDropdown = () => {
    if (isDropdownVisible) {
      Animated.timing(dropdownAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsDropdownVisible(false));
    }
  };

  // Handle menu item click
  const handleMenuItemClick = (item: string) => {
    closeDropdown();
    
    if (item === 'Settings') {

      console.log('Settings clicked - navigation depends on your setup');
      navigation.navigate('Settings');
      
    }
        console.log(`Clicked: ${item}`);
  };

  // Enter search mode with animation
  const enterSearchMode = () => {
    setIsSearchMode(true);
    Animated.timing(searchAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Exit search mode
  const exitSearchMode = () => {
    setSearchQuery('');
    setFilteredStatuses(dummyStatuses);
    setFilteredChannels(dummyChannels);
    Animated.timing(searchAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsSearchMode(false));
  };

  // Handle search input change
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setFilteredStatuses(dummyStatuses);
      setFilteredChannels(dummyChannels);
    } else {
      const query = text.toLowerCase();
      
      // Filter statuses
      const filteredStatus = dummyStatuses.filter(status =>
        status.name.toLowerCase().includes(query)
      );
      setFilteredStatuses(filteredStatus);
      
      // Filter channels
      const filteredChannel = dummyChannels.filter(channel =>
        channel.name.toLowerCase().includes(query)
      );
      setFilteredChannels(filteredChannel);
    }
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredStatuses(dummyStatuses);
    setFilteredChannels(dummyChannels);
  };

  // Render search header
  const renderSearchHeader = () => {
    return (
      <View style={[updatesScreenStyles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <Animated.View
          style={[
            updatesScreenStyles.headerTitleContainer,
            {
              transform: [{
                translateX: searchAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -50],
                }),
              }],
              opacity: searchAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ]}
        >
          <Text style={[updatesScreenStyles.headerTitle, { color: theme.textPrimary }]}>Updates</Text>
        </Animated.View>

        <Animated.View
          style={[
            updatesScreenStyles.searchInputContainer,
            {
              opacity: searchAnimation,
              transform: [
                {
                  translateX: searchAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[updatesScreenStyles.searchContainer, { backgroundColor: theme.searchBackground }]}>
            <TouchableOpacity
              onPress={exitSearchMode}
              style={updatesScreenStyles.searchBackButton}
            >
              <Image
                source={require('../../../assets/icons/back.png')}
                style={[updatesScreenStyles.searchBackIcon, { tintColor: theme.textPrimary }]}
                resizeMode="contain"
              />
            </TouchableOpacity>
            
            <TextInput
              style={[updatesScreenStyles.searchInput, { color: theme.searchText }]}
              placeholder="Search status and channels..."
              placeholderTextColor={theme.textTertiary}
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoFocus={false}
            />
            
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={clearSearch}
                style={updatesScreenStyles.clearButton}
              >
                <Text style={[updatesScreenStyles.clearIcon, { color: theme.textTertiary }]}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        <View style={updatesScreenStyles.headerActions}>
          {!isSearchMode && (
            <TouchableOpacity
              style={updatesScreenStyles.headerIconButton}
              onPress={enterSearchMode}
            >
              <Image
                source={require('../../../assets/icons/search.png')}
                style={[updatesScreenStyles.searchIcon, { tintColor: theme.textPrimary }]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={updatesScreenStyles.headerIconButton}
            onPress={toggleDropdown}
          >
            <Image
              source={require('../../../assets/icons/menu-bar.png')}
              style={[updatesScreenStyles.moreIcon, { tintColor: theme.textPrimary }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderStatusItem = ({ item }: { item: typeof dummyStatuses[0] }) => {
    if (item.id === '1') {
      // My Status card
      return (
        <TouchableOpacity style={updatesScreenStyles.myStatusCard}>
          <View style={updatesScreenStyles.statusAvatarContainer}>
            <View style={[updatesScreenStyles.myStatusAvatar, { backgroundColor: theme.whatsappGreen }]}>
              <Text style={[updatesScreenStyles.myStatusAvatarText, { color: theme.white }]}>{item.avatar}</Text>
            </View>
            {/* Add photo/video status icon (existing WhatsApp-style plus) */}
            <View style={[updatesScreenStyles.addStatusIcon, { backgroundColor: theme.whatsappGreen }]}>
              <Text style={[updatesScreenStyles.addStatusIconText, { color: theme.white }]}>+</Text>
            </View>
          </View>
          <Text style={[updatesScreenStyles.statusName, { color: theme.textPrimary }]} numberOfLines={1}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    }

    // Other status cards
    return (
      <TouchableOpacity style={updatesScreenStyles.statusCard}>
        <View style={updatesScreenStyles.statusImageContainer}>
          <View style={[updatesScreenStyles.statusImagePlaceholder, { backgroundColor: theme.backgroundGray }]} />
          <View style={[
            updatesScreenStyles.statusProfileAvatar,
            { backgroundColor: theme.whatsappGreen },
            item.hasSeen ? updatesScreenStyles.seenStatusAvatar : updatesScreenStyles.unseenStatusAvatar
          ]}>
            <Text style={[updatesScreenStyles.statusProfileAvatarText, { color: theme.white }]}>{item.avatar}</Text>
          </View>
        </View>
        <Text style={[updatesScreenStyles.statusName, { color: theme.textPrimary }]} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderChannelItem = ({ item }: { item: typeof dummyChannels[0] }) => (
    <TouchableOpacity style={[updatesScreenStyles.channelCard, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
      <View style={[updatesScreenStyles.channelAvatar, { backgroundColor: theme.backgroundGray }]}>
        <Text style={updatesScreenStyles.channelAvatarText}>📢</Text>
      </View>
      <View style={updatesScreenStyles.channelInfo}>
        <View style={updatesScreenStyles.channelHeader}>
          <Text style={[updatesScreenStyles.channelName, { color: theme.textPrimary }]}>{item.name}</Text>
          {item.isVerified && (
            <Text style={[updatesScreenStyles.verifiedBadge, { color: theme.whatsappGreen }]}>✓</Text>
          )}
          {item.isMuted && (
            <Text style={updatesScreenStyles.mutedIcon}>🔇</Text>
          )}
        </View>
        <Text style={[updatesScreenStyles.channelLastUpdate, { color: theme.textSecondary }]}>{item.lastUpdate}</Text>
        <View style={updatesScreenStyles.channelMessagePreview}>
          {item.messageType === 'link' && (
            <Text style={updatesScreenStyles.linkIcon}>🔗</Text>
          )}
          <Text style={[updatesScreenStyles.channelLastMessage, { color: theme.textSecondary }]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
      </View>
      {item.hasUnread && (
        <View style={[updatesScreenStyles.unreadIndicator, { backgroundColor: theme.unreadBadge }]} />
      )}
    </TouchableOpacity>
  );

  // Check if there are no results
  const noStatusResults = searchQuery.length > 0 && filteredStatuses.length === 0;
  const noChannelResults = searchQuery.length > 0 && filteredChannels.length === 0;
  const noResultsAtAll = noStatusResults && noChannelResults;

  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <SafeAreaView style={[updatesScreenStyles.container, { backgroundColor: theme.background }]}>
        <StatusBar
          backgroundColor={theme.background}
          barStyle={isDark ? 'light-content' : 'dark-content'}
        />
        
        {/* Header */}
        {renderSearchHeader()}

        {/* Dropdown Menu */}
        {isDropdownVisible && (
          <>
            <TouchableWithoutFeedback onPress={closeDropdown}>
              <View style={[updatesScreenStyles.overlay, { backgroundColor: 'transparent' }]} />
            </TouchableWithoutFeedback>
            <Animated.View
              style={[
                updatesScreenStyles.dropdownMenu,
                { backgroundColor: theme.background },
                {
                  opacity: dropdownAnimation,
                  transform: [
                    {
                      translateY: dropdownAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-10, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[updatesScreenStyles.menuItem, { backgroundColor: theme.background, borderBottomColor: theme.border }]}
                  onPress={() => handleMenuItemClick(item)}
                >
                  <Text style={[updatesScreenStyles.menuItemText, { color: theme.textPrimary }]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </>
        )}

        {/* Status Section */}
        {(!searchQuery || filteredStatuses.length > 0) && (
          <View style={[updatesScreenStyles.statusSection, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
            <Text style={[updatesScreenStyles.sectionTitle, { color: theme.textSecondary }]}>Status</Text>
            {filteredStatuses.length > 0 ? (
              <FlatList
                data={filteredStatuses}
                renderItem={renderStatusItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={updatesScreenStyles.statusList}
              />
            ) : null}
          </View>
        )}

        {/* Channels Section */}
        <ScrollView style={[updatesScreenStyles.channelsSection, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
          {/* No results message */}
          {noResultsAtAll ? (
            <View style={updatesScreenStyles.noResultsContainer}>
              <Text style={[updatesScreenStyles.noResultsText, { color: theme.textSecondary }]}>
                No results found for "{searchQuery}"
              </Text>
            </View>
          ) : (
            <>
              {(!searchQuery || filteredChannels.length > 0) && (
                <View style={updatesScreenStyles.channelsHeader}>
                  <Text style={[updatesScreenStyles.sectionTitle, { color: theme.textSecondary }]}>Channels</Text>
                  {!searchQuery && (
                    <TouchableOpacity style={updatesScreenStyles.exploreButton}>
                      <Text style={updatesScreenStyles.exploreButtonText}>Explore</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              
              {filteredChannels.length > 0 ? (
                <FlatList
                  data={filteredChannels}
                  renderItem={renderChannelItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              ) : null}
              
              {/* Show message if only one section has no results */}
              {(noStatusResults && filteredChannels.length > 0) && (
                <View style={updatesScreenStyles.sectionNoResults}>
                  <Text style={updatesScreenStyles.sectionNoResultsText}>
                    No status results for "{searchQuery}"
                  </Text>
                </View>
              )}
              
              {(noChannelResults && filteredStatuses.length > 0) && (
                <View style={updatesScreenStyles.sectionNoResults}>
                  <Text style={updatesScreenStyles.sectionNoResultsText}>
                    No channel results for "{searchQuery}"
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Floating Action Buttons (Text status + Camera status) */}
        <View style={updatesScreenStyles.fabContainer}>
          {/* Text status (pencil) - smaller FAB above camera, WhatsApp-style */}
          <TouchableOpacity
            style={[updatesScreenStyles.pencilFab, { backgroundColor: theme.backgroundGray }]}
            onPress={() => {
              console.log('Text status FAB pressed');
            }}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../../assets/icons/text.png')}
              style={[updatesScreenStyles.pencilIconImage, { tintColor: theme.textPrimary }]}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Camera status (photo/video) */}
          <TouchableOpacity
            style={[updatesScreenStyles.cameraFab, { backgroundColor: theme.floatingButton }]}
            onPress={() => {
              console.log('Camera status FAB pressed');
            }}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../../assets/icons/whatsapp-camera.png')}
              style={[updatesScreenStyles.cameraIcon, { tintColor: theme.white }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};