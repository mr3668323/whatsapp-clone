import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { themePickerModalStyles } from '../styles/ThemePickerModal.styles';
import type { ThemeMode } from '../../../contexts/ThemeContext';

interface ThemePickerModalProps {
  visible: boolean;
  currentTheme: ThemeMode;
  onClose: () => void;
  onSelect: () => void;
}

export const ThemePickerModal: React.FC<ThemePickerModalProps> = ({
  visible,
  currentTheme,
  onClose,
  onSelect,
}) => {
  const { theme, setThemeMode } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(currentTheme);

  const handleOK = async () => {
    await setThemeMode(selectedTheme);
    onSelect();
  };

  const handleCancel = () => {
    setSelectedTheme(currentTheme);
    onClose();
  };

  const options: { value: ThemeMode; label: string }[] = [
    { value: 'system', label: 'System default' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={themePickerModalStyles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[themePickerModalStyles.modalContainer, { backgroundColor: theme.background }]}>
              <View style={[themePickerModalStyles.header, { borderBottomColor: theme.border }]}>
                <Text style={[themePickerModalStyles.headerTitle, { color: theme.textPrimary }]}>
                  Choose theme
                </Text>
              </View>

              <View style={themePickerModalStyles.optionsContainer}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      themePickerModalStyles.optionRow,
                      { borderBottomColor: theme.border },
                    ]}
                    onPress={() => setSelectedTheme(option.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={[themePickerModalStyles.optionLabel, { color: theme.textPrimary }]}>
                      {option.label}
                    </Text>
                    <View style={themePickerModalStyles.radioContainer}>
                      {selectedTheme === option.value ? (
                        <View style={[themePickerModalStyles.radioSelected, { backgroundColor: theme.textPrimary }]}>
                          <View style={[themePickerModalStyles.radioInner, { backgroundColor: theme.background }]} />
                        </View>
                      ) : (
                        <View style={[themePickerModalStyles.radioUnselected, { borderColor: theme.border }]} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={[themePickerModalStyles.buttonContainer, { borderTopColor: theme.border }]}>
                <TouchableOpacity
                  style={themePickerModalStyles.button}
                  onPress={handleCancel}
                  activeOpacity={0.7}
                >
                  <Text style={[themePickerModalStyles.buttonText, { color: theme.textPrimary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={themePickerModalStyles.button}
                  onPress={handleOK}
                  activeOpacity={0.7}
                >
                  <Text style={[themePickerModalStyles.buttonText, { color: theme.textPrimary }]}>
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
