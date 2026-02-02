import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { countryPickerStyles } from '../styles/CountryPicker.styles';
import { useTheme } from '../../../contexts/ThemeContext';
import { Country, countries } from '../../../data/countries';

interface CountryPickerProps {
  selectedCountry: Country;
  onCountrySelect: (country: Country) => void;
}

export const CountryPicker: React.FC<CountryPickerProps> = ({
  selectedCountry,
  onCountrySelect,
}) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (country: Country) => {
    onCountrySelect(country);
    setModalVisible(false);
  };

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      style={[countryPickerStyles.modalItem, { backgroundColor: theme.background, borderBottomColor: theme.border }]}
      onPress={() => handleSelect(item)}
    >
      <Text style={countryPickerStyles.modalFlag}>{item.flag}</Text>
      <Text style={[countryPickerStyles.modalCountryName, { color: theme.textPrimary }]}>{item.name}</Text>
      <Text style={[countryPickerStyles.modalDialCode, { color: theme.textSecondary }]}>{item.dialCode}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity 
        style={countryPickerStyles.container} 
        onPress={() => setModalVisible(true)}
      >
        <View style={countryPickerStyles.flagContainer}>
          <Text style={countryPickerStyles.flag}>{selectedCountry.flag}</Text>
        </View>
        <Text style={countryPickerStyles.countryName}>{selectedCountry.name}</Text>
        <Text style={countryPickerStyles.dropdown}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[countryPickerStyles.modalOverlay, { backgroundColor: theme.overlayDark }]}>
          <View style={[countryPickerStyles.modalContent, { backgroundColor: theme.background }]}>
            <View style={[countryPickerStyles.modalHeader, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
              <Text style={[countryPickerStyles.modalTitle, { color: theme.textPrimary }]}>Select Country</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={[countryPickerStyles.modalClose, { color: theme.textPrimary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={countries}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              style={{ backgroundColor: theme.background }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};