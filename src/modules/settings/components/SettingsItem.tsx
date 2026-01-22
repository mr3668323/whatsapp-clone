import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { settingsItemStyles } from '../styles/SettingsItem.styles';

type SettingsItemProps = {
  icon?: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
};

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
}) => {
  return (
    <TouchableOpacity
      style={settingsItemStyles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <View style={settingsItemStyles.iconContainer}>
          <Text style={settingsItemStyles.iconText}>{icon}</Text>
        </View>
      )}
      
      <View style={settingsItemStyles.content}>
        <Text style={settingsItemStyles.title}>{title}</Text>
        {subtitle && (
          <Text style={settingsItemStyles.subtitle}>{subtitle}</Text>
        )}
      </View>
      
      {showArrow && (
        <Text style={settingsItemStyles.arrow}>›</Text>
      )}
    </TouchableOpacity>
  );
};