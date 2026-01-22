import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { communitiesMenuBarStyles } from '../styles/CommunitiesMenuBar.styles';
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
        style={communitiesMenuBarStyles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={communitiesMenuBarStyles.menuContainer}>
          <SafeAreaView style={communitiesMenuBarStyles.safeArea}>
            <View style={communitiesMenuBarStyles.menuContent}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={communitiesMenuBarStyles.menuItem}
                  onPress={() => handleItemPress(item.title)}
                  activeOpacity={0.7}
                >
                  <Text style={communitiesMenuBarStyles.menuText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </SafeAreaView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};