import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { sectionHeaderStyles } from '../styles/SectionHeader.styles';

type SectionHeaderProps = {
  title: string;
  marginTop?: number;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  marginTop = 0 
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={[sectionHeaderStyles.container, { marginTop, backgroundColor: theme.background }]}>
      <Text style={[sectionHeaderStyles.title, { color: theme.textSecondary }]}>{title}</Text>
    </View>
  );
};