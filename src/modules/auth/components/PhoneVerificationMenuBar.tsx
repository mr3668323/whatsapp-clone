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
import { useTheme } from '../../../contexts/ThemeContext';

type PhoneVerificationMenuBarProps = {
  visible: boolean;
  onClose: () => void;
};
    
export const PhoneVerificationMenuBar: React.FC<PhoneVerificationMenuBarProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  
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
        style={[phoneVerificationMenuBarStyles.overlay, { backgroundColor: 'transparent' }]}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[phoneVerificationMenuBarStyles.menuContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <SafeAreaView style={[phoneVerificationMenuBarStyles.safeArea, { backgroundColor: theme.background }]}>
            <View style={phoneVerificationMenuBarStyles.menuContent}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[phoneVerificationMenuBarStyles.menuItem, { borderBottomColor: theme.border }]}
                  onPress={() => handleItemPress(item.title)}
                  activeOpacity={0.7}
                >
                  <Text style={[phoneVerificationMenuBarStyles.menuText, { color: theme.textPrimary }]}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </SafeAreaView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};