import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { menuBarStyles } from '../styles/MenuBar.styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types/navigation';

type MenuBarProps = {
  visible: boolean;
  onClose: () => void;
};

type MenuBarNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const MenuBar: React.FC<MenuBarProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<MenuBarNavigationProp>();

  const menuItems = [
    { id: 1, title: 'New group' },
    { id: 2, title: 'New community' },
    { id: 3, title: 'Broadcast lists' },
    { id: 4, title: 'Linked devices' },
    { id: 5, title: 'Starred' },
    { id: 6, title: 'Read all' },
    { id: 7, title: 'Settings' },
  ];

  const handleItemPress = (title: string) => {
    onClose();
    
    if (title === 'Settings') {
      navigation.navigate('Settings');
    }
    // Add other navigation handlers as needed
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={menuBarStyles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={menuBarStyles.menuContainer}>
          <SafeAreaView style={menuBarStyles.safeArea}>
            <View style={menuBarStyles.menuContent}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={menuBarStyles.menuItem}
                  onPress={() => handleItemPress(item.title)}
                  activeOpacity={0.7}
                >
                  <Text style={menuBarStyles.menuText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </SafeAreaView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};