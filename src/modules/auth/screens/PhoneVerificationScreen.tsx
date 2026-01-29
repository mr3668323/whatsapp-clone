import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { phoneVerificationStyles } from '../styles/PhoneVerification.styles';
import { Country } from '../../../data/countries';
import { CountryPicker } from '../components/CountryPicker';
import { PhoneInput } from '../components/PhoneInput';
import { PhoneVerificationMenuBar } from '../components/PhoneVerificationMenuBar';
import { RootStackParamList } from '../../../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../../styles/colors';

type PhoneVerificationScreenProps = NativeStackScreenProps<RootStackParamList, 'PhoneVerification'>;

export const PhoneVerificationScreen: React.FC<PhoneVerificationScreenProps> = ({ navigation }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    name: 'Pakistan',
    code: 'PK',
    dialCode: '+92',
    flag: '🇵🇰',
    maxLength: 10,
    pattern: /^3[0-9]{9}$/
  });
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [menuVisible, setMenuVisible] = useState(false); // ADD THIS STATE


  const handleNext = () => {
    if (phoneNumber.length !== selectedCountry.maxLength) {
      Alert.alert(
        'Invalid Phone Number',
        `Please enter ${selectedCountry.maxLength} digits for ${selectedCountry.name}`
      );
      return;
    }

    if (selectedCountry.pattern && !selectedCountry.pattern.test(phoneNumber)) {
      Alert.alert(
        'Invalid Phone Number',
        `Please enter a valid ${selectedCountry.name} phone number`
      );
      return;
    }

    const fullPhoneNumber = selectedCountry.dialCode + phoneNumber;
    
    navigation.navigate('OTPVerification', { 
      phoneNumber: fullPhoneNumber,
      countryCode: selectedCountry.code 
    });
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    if (phoneNumber.length > country.maxLength) {
      setPhoneNumber(phoneNumber.slice(0, country.maxLength));
    }
  };

  const handleWhatsMyNumber = () => {
    Alert.alert(
      "What's my number?",
      "Your phone number is the number associated with your device's SIM card."
    );
  };

  const handlePhoneInputFocus = () => {
    // System keyboard will handle input
  };

  const isPhoneValid = () => {
    return phoneNumber.length === selectedCountry.maxLength;
  };

  return (
    <SafeAreaView style={phoneVerificationStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Menu Bar Component */}
        <PhoneVerificationMenuBar 
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />
        
        {/* Header */}
      <View style={phoneVerificationStyles.header}>
        <TouchableOpacity 
          style={phoneVerificationStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../../../assets/icons/back.png')}
            style={phoneVerificationStyles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <Text style={phoneVerificationStyles.headerTitle}>Phone Verification</Text>
        
        <TouchableOpacity 
          style={phoneVerificationStyles.menuButton}
          onPress={() => setMenuVisible(true)}
        >
          <Image
            source={require('../../../assets/icons/menu-bar.png')}
            style={phoneVerificationStyles.menuIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Main content area */}
      <ScrollView
        style={phoneVerificationStyles.scrollView}
        contentContainerStyle={phoneVerificationStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={phoneVerificationStyles.title}>Enter your phone number</Text>
        
        <View style={phoneVerificationStyles.subtitleContainer}>
          <Text style={phoneVerificationStyles.subtitle}>
            WhatsApp will need to verify your phone number. Carrier charges may apply.{' '}
          </Text>
          <TouchableOpacity onPress={handleWhatsMyNumber}>
            <Text style={phoneVerificationStyles.linkText}>What's my number?</Text>
          </TouchableOpacity>
        </View>

        <CountryPicker
          selectedCountry={selectedCountry}
          onCountrySelect={handleCountrySelect}
        />

        <PhoneInput
          country={selectedCountry}
          phoneNumber={phoneNumber}
          onChangePhoneNumber={setPhoneNumber}
          onFocus={handlePhoneInputFocus}
          editable={true}
        />

        {/* Add spacer at bottom of ScrollView */}
        <View style={phoneVerificationStyles.scrollSpacer} />
      </ScrollView>

      {/* Fixed Button at Bottom - Outside ScrollView */}
      <View style={phoneVerificationStyles.buttonContainer}>
        <TouchableOpacity 
          style={[
            phoneVerificationStyles.nextButton,
            !isPhoneValid() && phoneVerificationStyles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!isPhoneValid()}
        >
          <Text style={phoneVerificationStyles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};