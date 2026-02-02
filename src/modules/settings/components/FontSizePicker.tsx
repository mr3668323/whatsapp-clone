import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { fontSizePickerStyles } from '../styles/FontSizePicker.styles';

type FontSize = 'small' | 'medium' | 'large';

type FontSizePickerProps = {
  value: FontSize;
  onValueChange: (value: FontSize) => void;
};

const fontSizeOptions: { label: string; value: FontSize }[] = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

export const FontSizePicker: React.FC<FontSizePickerProps> = ({ value, onValueChange }) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleSelect = (selectedValue: FontSize) => {
    onValueChange(selectedValue);
    setModalVisible(false);
  };

  const getDisplayValue = () => {
    return fontSizeOptions.find(opt => opt.value === value)?.label || 'Medium';
  };

  return (
    <>
      <TouchableOpacity
        style={[
          fontSizePickerStyles.picker,
          {
            backgroundColor: theme.background,
            borderColor: theme.border,
          },
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[fontSizePickerStyles.pickerText, { color: theme.textPrimary }]}>
          {getDisplayValue()}
        </Text>
        <Text style={[fontSizePickerStyles.chevron, { color: theme.textTertiary }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={fontSizePickerStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[
              fontSizePickerStyles.modalContent,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            {fontSizeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  fontSizePickerStyles.option,
                  {
                    backgroundColor: theme.background,
                    borderBottomColor: theme.border,
                  },
                  value === option.value && {
                    backgroundColor: theme.backgroundLight,
                  },
                ]}
                onPress={() => handleSelect(option.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    fontSizePickerStyles.optionText,
                    { color: theme.textPrimary },
                    value === option.value && { color: theme.whatsappGreen },
                  ]}
                >
                  {option.label}
                </Text>
                {value === option.value && (
                  <Text style={[fontSizePickerStyles.checkmark, { color: theme.whatsappGreen }]}>
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};
