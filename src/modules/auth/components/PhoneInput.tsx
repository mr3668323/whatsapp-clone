import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { phoneInputStyles } from '../styles/PhoneInput.styles';
import { colors } from '../../../styles/colors';
import { Country } from '../../../data/countries';

interface PhoneInputProps {
  country: Country;
  phoneNumber: string;
  onChangePhoneNumber: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  editable?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  country,
  phoneNumber,
  onChangePhoneNumber,
  onFocus,
  onBlur,
  editable = true,
}) => {
  const handleTextChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length <= country.maxLength) {
      onChangePhoneNumber(numericText);
    }
  };

  const formatPhoneNumber = () => {
    return phoneNumber;
  };

  return (
    <View style={phoneInputStyles.container}>
      <View style={phoneInputStyles.codeContainer}>
        <Text style={phoneInputStyles.codeText}>{country.dialCode}</Text>
      </View>
      <View style={phoneInputStyles.divider} />
      <TouchableOpacity 
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={() => onFocus && onFocus()}
      >
        <TextInput
          style={phoneInputStyles.input}
          value={formatPhoneNumber()}
          onChangeText={handleTextChange}
          placeholder="Phone number"
          placeholderTextColor={colors.textTertiary}
          keyboardType="numeric"
          maxLength={country.maxLength}
          autoFocus={false}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </TouchableOpacity>
      {phoneNumber.length > 0 && (
        <Text style={phoneInputStyles.lengthText}>
          {phoneNumber.length}/{country.maxLength}
        </Text>
      )}
    </View>
  );
};