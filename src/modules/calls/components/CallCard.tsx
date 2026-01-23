import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
  const getCallIcon = (type: string) => {
    switch (type) {
      case 'incoming':
        return '↓'; // Incoming arrow
      case 'outgoing':
        return '↑'; // Outgoing arrow
      case 'missed':
        return '↓'; // Missed also uses down arrow (red)
      default:
        return '☎';
    }
  };

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
          {call.name.charAt(0)}
        </Text>
      </View>

      {/* Center Info */}
      <View style={callCardStyles.infoContainer}>
        <Text style={callCardStyles.name} numberOfLines={1}>
          {call.name}
        </Text>
        <View style={callCardStyles.callInfo}>
          <Text style={[callCardStyles.callTypeIcon, { color: getCallColor(call.type) }]}>
            {getCallIcon(call.type)}
          </Text>
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
            <Text style={callCardStyles.videoIcon}>📹</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={callCardStyles.audioButton}
          onPress={onAudioPress}
          activeOpacity={0.7}
        >
          <Text style={callCardStyles.audioIcon}>☎</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};