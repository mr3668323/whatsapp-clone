import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { profileHeaderStyles } from '../styles/ProfileHeader.styles';

type ProfileHeaderProps = {
  onPress?: () => void;
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={profileHeaderStyles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={profileHeaderStyles.avatarContainer}>
        <View style={profileHeaderStyles.avatar}>
          <Text style={profileHeaderStyles.avatarText}>M</Text>
        </View>
      </View>
      
      <View style={profileHeaderStyles.infoContainer}>
        <Text style={profileHeaderStyles.name}>My Number</Text>
        <View style={profileHeaderStyles.subtitleContainer}>
          <Text style={profileHeaderStyles.subtitle}>What's happening?</Text>
        </View>
      </View>
      
      <View style={profileHeaderStyles.rightIcons}>
        <TouchableOpacity style={profileHeaderStyles.iconButton}>
          <Text style={profileHeaderStyles.iconText}>◷</Text>
        </TouchableOpacity>
        <TouchableOpacity style={profileHeaderStyles.iconButton}>
          <Text style={profileHeaderStyles.iconText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};