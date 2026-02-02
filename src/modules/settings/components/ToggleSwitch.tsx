import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { toggleSwitchStyles } from '../styles/ToggleSwitch.styles';

type ToggleSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onValueChange }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        toggleSwitchStyles.track,
        {
          backgroundColor: value ? theme.whatsappGreen : theme.backgroundGray,
        },
      ]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.7}
    >
      <View
        style={[
          toggleSwitchStyles.thumb,
          {
            backgroundColor: theme.white,
            transform: [{ translateX: value ? 20 : 0 }],
          },
        ]}
      />
    </TouchableOpacity>
  );
};
