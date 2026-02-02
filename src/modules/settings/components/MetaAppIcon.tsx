import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { metaAppIconStyles } from '../styles/MetaAppIcon.styles';

type MetaAppIconProps = {
  iconSource: any;
  name: string;
  onPress?: () => void;
};

export const MetaAppIcon: React.FC<MetaAppIconProps> = ({ 
  iconSource, 
  name, 
  onPress 
}) => {
  const { theme, isDark } = useTheme();
  
  // Icon tint color: black in light mode, silver/gray in dark mode
  const iconTintColor = isDark ? theme.iconGray : theme.textPrimary;
  
  return (
    <TouchableOpacity
      style={metaAppIconStyles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[metaAppIconStyles.iconContainer, { backgroundColor: theme.backgroundGray }]}>
        <Image
          source={iconSource}
          style={[metaAppIconStyles.iconImage, { tintColor: iconTintColor }]}
          resizeMode="contain"
        />
      </View>
      <Text style={[metaAppIconStyles.name, { color: theme.textPrimary }]}>{name}</Text>
    </TouchableOpacity>
  );
};