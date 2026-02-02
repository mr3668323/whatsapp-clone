import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { communitiesMenuBarStyles } from '../styles/CommunitiesMenuBar.styles';
import { useTheme } from '../../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types/navigation';

type CommunitiesMenuBarProps = {
  visible: boolean;
  onClose: () => void;
};

type CommunitiesMenuBarNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CommunitiesMenuBar: React.FC<CommunitiesMenuBarProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<CommunitiesMenuBarNavigationProp>();
  const { theme } = useTheme();

  const menuItems = [
    { id: '1', title: 'Settings' },
  ];

  const handleItemPress = (title: string) => {
    onClose();
    
    if (title === 'Settings') {
      navigation.navigate('Settings');
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
        style={[communitiesMenuBarStyles.overlay, { backgroundColor: 'transparent' }]}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[communitiesMenuBarStyles.menuContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <SafeAreaView style={[communitiesMenuBarStyles.safeArea, { backgroundColor: theme.background }]}>
            <View style={communitiesMenuBarStyles.menuContent}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[communitiesMenuBarStyles.menuItem, { borderBottomColor: theme.border }]}
                  onPress={() => handleItemPress(item.title)}
                  activeOpacity={0.7}
                >
                  <Text style={[communitiesMenuBarStyles.menuText, { color: theme.textPrimary }]}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </SafeAreaView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};