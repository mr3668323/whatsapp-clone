import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Linking,
} from 'react-native';
import { phoneVerificationMenuBarStyles } from '../styles/PhoneVerificationMenuBar.styles';

type PhoneVerificationMenuBarProps = {
  visible: boolean;
  onClose: () => void;
};
    
export const PhoneVerificationMenuBar: React.FC<PhoneVerificationMenuBarProps> = ({ visible, onClose }) => {
  const menuItems = [
    { id: '1', title: 'Help Centre' },
  ];

  const handleItemPress = (title: string) => {
    onClose();
    
    if (title === 'Help Centre') {
      // Open WhatsApp Help Centre in browser
      Linking.openURL('https://faq.whatsapp.com/').catch(err => 
        console.error('Failed to open URL:', err)
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={phoneVerificationMenuBarStyles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={phoneVerificationMenuBarStyles.menuContainer}>
          <SafeAreaView style={phoneVerificationMenuBarStyles.safeArea}>
            <View style={phoneVerificationMenuBarStyles.menuContent}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={phoneVerificationMenuBarStyles.menuItem}
                  onPress={() => handleItemPress(item.title)}
                  activeOpacity={0.7}
                >
                  <Text style={phoneVerificationMenuBarStyles.menuText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </SafeAreaView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};