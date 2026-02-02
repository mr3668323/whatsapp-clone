import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { profileHeaderStyles } from '../styles/ProfileHeader.styles';
import { useTheme } from '../../../contexts/ThemeContext';

type ProfileHeaderProps = {
  onPress?: () => void;
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onPress }) => {
  const { theme, isDark } = useTheme();
  
  // QR icon tint: black in light mode, silver/gray in dark mode
  const qrIconTintColor = isDark ? theme.iconGray : theme.textPrimary;
  // Add icon tint: always WhatsApp green
  const addIconTintColor = theme.whatsappGreen;
  
  return (
    <TouchableOpacity
      style={[profileHeaderStyles.container, { backgroundColor: theme.background, borderBottomColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={profileHeaderStyles.avatarContainer}>
        <View style={[profileHeaderStyles.avatar, { backgroundColor: theme.whatsappGreen }]}>
          <Text style={[profileHeaderStyles.avatarText, { color: theme.white }]}>M</Text>
        </View>
      </View>
      
      <View style={profileHeaderStyles.infoContainer}>
        <Text style={[profileHeaderStyles.name, { color: theme.textPrimary }]}>My Number</Text>
        <View style={[profileHeaderStyles.subtitleContainer, { backgroundColor: theme.backgroundGray }]}>
          <Text style={[profileHeaderStyles.subtitle, { color: theme.textSecondary }]}>What's happening?</Text>
        </View>
      </View>
      
      <View style={profileHeaderStyles.rightIcons}>
        <TouchableOpacity style={[profileHeaderStyles.iconButton, { backgroundColor: theme.backgroundGray }]}>
          <Image
            source={require('../../../assets/icons/qr-codeSetting.png')}
            style={[profileHeaderStyles.iconImage, { tintColor: qrIconTintColor }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={[profileHeaderStyles.iconButton, { backgroundColor: theme.backgroundGray }]}>
          <Image
            source={require('../../../assets/icons/plusSetting.png')}
            style={[profileHeaderStyles.iconImage, { tintColor: addIconTintColor }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};