import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { settingsItemStyles } from '../styles/SettingsItem.styles';

type SettingsItemProps = {
  iconSource?: any;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
};

export const SettingsItem: React.FC<SettingsItemProps> = ({
  iconSource,
  title,
  subtitle,
  onPress,
  showArrow = true,
}) => {
  const { theme, isDark } = useTheme();
  
  // Icon tint color: black in light mode, silver/gray in dark mode
  const iconTintColor = isDark ? theme.iconGray : theme.textPrimary;
  
  return (
    <TouchableOpacity
      style={[settingsItemStyles.container, { backgroundColor: theme.background, borderBottomColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {iconSource && (
        <View style={[settingsItemStyles.iconContainer, { backgroundColor: theme.backgroundGray }]}>
          <Image
            source={iconSource}
            style={[settingsItemStyles.iconImage, { tintColor: iconTintColor }]}
            resizeMode="contain"
          />
        </View>
      )}
      
      <View style={settingsItemStyles.content}>
        <Text style={[settingsItemStyles.title, { color: theme.textPrimary }]}>{title}</Text>
        {subtitle && (
          <Text style={[settingsItemStyles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
        )}
      </View>
      
      {showArrow && (
        <Text style={[settingsItemStyles.arrow, { color: theme.textTertiary }]}>›</Text>
      )}
    </TouchableOpacity>
  );
};