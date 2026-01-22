import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { metaAppIconStyles } from '../styles/MetaAppIcon.styles';

type MetaAppIconProps = {
  icon: string;
  name: string;
  onPress?: () => void;
};

export const MetaAppIcon: React.FC<MetaAppIconProps> = ({ 
  icon, 
  name, 
  onPress 
}) => {
  return (
    <TouchableOpacity
      style={metaAppIconStyles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={metaAppIconStyles.iconContainer}>
        <Text style={metaAppIconStyles.icon}>{icon}</Text>
      </View>
      <Text style={metaAppIconStyles.name}>{name}</Text>
    </TouchableOpacity>
  );
};