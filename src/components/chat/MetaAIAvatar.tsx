import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface MetaAIAvatarProps {
  size?: number;
}

export const MetaAIAvatar: React.FC<MetaAIAvatarProps> = ({ size = 48 }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {/* Outer ring - Blue */}
      <View style={[styles.ring, { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: '#0084FF', // Meta AI blue - specific brand color
      }]} />
      {/* Middle ring - Purple */}
      <View style={[styles.ring, { 
        width: size - 6, 
        height: size - 6, 
        borderRadius: (size - 6) / 2,
        borderWidth: 2,
        borderColor: '#8B5CF6', // Meta AI purple - specific brand color
        top: 3,
        left: 3,
      }]} />
      {/* Inner ring - Green */}
      <View style={[styles.ring, { 
        width: size - 12, 
        height: size - 12, 
        borderRadius: (size - 12) / 2,
        borderWidth: 2,
        borderColor: '#10B981', // Meta AI green - specific brand color
        top: 6,
        left: 6,
      }]} />
      {/* Center - dark in dark mode, white in light mode */}
      <View style={[styles.center, { 
        width: size - 18, 
        height: size - 18, 
        borderRadius: (size - 18) / 2,
        backgroundColor: theme.background, // Use theme background for center
        top: 9,
        left: 9,
      }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
  },
  center: {
    position: 'absolute',
  },
});
