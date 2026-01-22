import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { countryPickerStyles } from '../styles/CountryPicker.styles';
import { Country, countries } from '../../../data/countries';

interface CountryPickerProps {
  selectedCountry: Country;
  onCountrySelect: (country: Country) => void;
}

export const CountryPicker: React.FC<CountryPickerProps> = ({
  selectedCountry,
  onCountrySelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (country: Country) => {
    onCountrySelect(country);
    setModalVisible(false);
  };

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      style={countryPickerStyles.modalItem}
      onPress={() => handleSelect(item)}
    >
      <Text style={countryPickerStyles.modalFlag}>{item.flag}</Text>
      <Text style={countryPickerStyles.modalCountryName}>{item.name}</Text>
      <Text style={countryPickerStyles.modalDialCode}>{item.dialCode}</Text>
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
        <View style={countryPickerStyles.modalOverlay}>
          <View style={countryPickerStyles.modalContent}>
            <View style={countryPickerStyles.modalHeader}>
              <Text style={countryPickerStyles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={countryPickerStyles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={countries}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};