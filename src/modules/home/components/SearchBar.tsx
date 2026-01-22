import React from 'react';
import { View, TextInput } from 'react-native';
import { searchBarStyles } from '../styles/SearchBar.styles';

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  searchQuery, 
  onSearchChange 
}) => {
  return (
    <View style={searchBarStyles.container}>
      <TextInput
        style={searchBarStyles.input}
        placeholder="Search..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={onSearchChange}
      />
    </View>
  );
};