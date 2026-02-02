import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { callCardStyles } from '../styles/CallCard.styles';
import { useTheme } from '../../../contexts/ThemeContext';
import type { CallLog } from '../../../data/dummyCalls';

interface CallCardProps {
  call: CallLog;
  onPress?: () => void;
  onVideoPress?: () => void;
  onAudioPress?: () => void;
}

export const CallCard: React.FC<CallCardProps> = ({ 
  call, 
  onPress,
  onVideoPress,
  onAudioPress 
}) => {
  const { theme } = useTheme();
  
  const getCallColor = (type: string) => {
    switch (type) {
      case 'incoming':
        return theme.callIncoming;
      case 'outgoing':
        return theme.callOutgoing;
      case 'missed':
        return theme.callMissed;
      default:
        return theme.textSecondary;
    }
  };

  return (
    <TouchableOpacity
      style={[callCardStyles.container, { backgroundColor: theme.background, borderBottomColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={[callCardStyles.avatarContainer, { backgroundColor: theme.whatsappGreen }]}>
        <Text style={[callCardStyles.avatarText, { color: theme.white }]}>
          {call.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Center Info */}
      <View style={callCardStyles.infoContainer}>
        <Text style={[callCardStyles.name, { color: theme.textPrimary }]} numberOfLines={1}>
          {call.name}
        </Text>
        <View style={callCardStyles.callInfo}>
          <View
            style={[
              callCardStyles.callTypeIconBullet,
              { backgroundColor: getCallColor(call.type) },
            ]}
          />
          <Text style={[callCardStyles.callTypeText, { color: getCallColor(call.type) }]}>
            {call.time}
          </Text>
        </View>
      </View>

      {/* Right Action Buttons */}
      <View style={callCardStyles.actionButtons}>
        {call.videoCall && (
          <TouchableOpacity
            style={callCardStyles.videoButton}
            onPress={onVideoPress}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../../assets/icons/video-call.png')}
              style={[callCardStyles.videoIcon, { tintColor: theme.iconGray }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={callCardStyles.audioButton}
          onPress={onAudioPress}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/icons/whatsapp-calls.png')}
            style={[callCardStyles.audioIcon, { tintColor: theme.iconGray }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};