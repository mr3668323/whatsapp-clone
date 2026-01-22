import React from 'react';
import { View, Text } from 'react-native';
import { sectionHeaderStyles } from '../styles/SectionHeader.styles';

type SectionHeaderProps = {
  title: string;
  marginTop?: number;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  marginTop = 0 
}) => {
  return (
    <View style={[sectionHeaderStyles.container, { marginTop }]}>
      <Text style={sectionHeaderStyles.title}>{title}</Text>
    </View>
  );
};