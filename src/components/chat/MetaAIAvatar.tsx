import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';

interface MetaAIAvatarProps {
  size?: number;
}

export const MetaAIAvatar: React.FC<MetaAIAvatarProps> = ({ size = 48 }) => {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {/* Outer ring - Blue */}
      <View style={[styles.ring, styles.ring1, { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        borderWidth: 2,
      }]} />
      {/* Middle ring - Purple */}
      <View style={[styles.ring, styles.ring2, { 
        width: size - 6, 
        height: size - 6, 
        borderRadius: (size - 6) / 2,
        borderWidth: 2,
        top: 3,
        left: 3,
      }]} />
      {/* Inner ring - Green */}
      <View style={[styles.ring, styles.ring3, { 
        width: size - 12, 
        height: size - 12, 
        borderRadius: (size - 12) / 2,
        borderWidth: 2,
        top: 6,
        left: 6,
      }]} />
      {/* White center */}
      <View style={[styles.center, { 
        width: size - 18, 
        height: size - 18, 
        borderRadius: (size - 18) / 2,
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
  ring1: {
    borderColor: '#0084FF', // Blue
  },
  ring2: {
    borderColor: '#8B5CF6', // Purple
  },
  ring3: {
    borderColor: '#10B981', // Green
  },
  center: {
    backgroundColor: colors.white,
    position: 'absolute',
  },
});
