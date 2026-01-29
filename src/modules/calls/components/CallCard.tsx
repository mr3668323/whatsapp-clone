import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { callCardStyles } from '../styles/CallCard.styles';
import { colors } from '../../../styles/colors';
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
  const getCallColor = (type: string) => {
    switch (type) {
      case 'incoming':
        return colors.callIncoming;
      case 'outgoing':
        return colors.callOutgoing;
      case 'missed':
        return colors.callMissed;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity
      style={callCardStyles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={callCardStyles.avatarContainer}>
        <Text style={callCardStyles.avatarText}>
          {call.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Center Info */}
      <View style={callCardStyles.infoContainer}>
        <Text style={callCardStyles.name} numberOfLines={1}>
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
              style={callCardStyles.videoIcon}
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
            style={callCardStyles.audioIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};