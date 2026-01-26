import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { chatMenuStyles } from '../../modules/chat/styles/ChatMenu.styles';

type ChatMenuProps = {
  visible: boolean;
  onClose: () => void;
  onDeleteChat: () => void;
};

export const ChatMenu: React.FC<ChatMenuProps> = ({ visible, onClose, onDeleteChat }) => {
  const handleDeletePress = () => {
    onClose();
    onDeleteChat();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={chatMenuStyles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={chatMenuStyles.menuContainer} onStartShouldSetResponder={() => true}>
          <SafeAreaView style={chatMenuStyles.safeArea}>
            <View style={chatMenuStyles.menuContent}>
              <TouchableOpacity
                style={chatMenuStyles.menuItem}
                onPress={handleDeletePress}
                activeOpacity={0.7}
              >
                <Text style={chatMenuStyles.menuText}>Delete chat</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
