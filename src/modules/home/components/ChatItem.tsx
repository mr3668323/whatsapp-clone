import type React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { chatItemStyles } from "../styles/ChatItem.styles"

export interface Chat {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  avatar: string
  isOnline: boolean
  unreadCount: number
}

interface ChatItemProps {
  chat: Chat
  onPress: (chatId: string) => void
}

export const ChatItem: React.FC<ChatItemProps> = ({ chat, onPress }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTime = (time: string) => {
    const date = new Date(time)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) return `${diffMins}m`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <TouchableOpacity
      onPress={() => onPress(chat.id)}
      style={[chatItemStyles.container, chat.unreadCount > 0 && chatItemStyles.containerActive]}
      activeOpacity={0.6}
    >
      <View style={chatItemStyles.avatar}>
        <Text style={chatItemStyles.avatarText}>{getInitials(chat.name)}</Text>
        {chat.isOnline && <View style={chatItemStyles.statusIndicator} />}
      </View>

      <View style={chatItemStyles.contentContainer}>
        <View style={chatItemStyles.header}>
          <Text style={chatItemStyles.name}>{chat.name}</Text>
          <Text style={chatItemStyles.time}>{formatTime(chat.timestamp)}</Text>
        </View>
        <View style={chatItemStyles.messageRow}>
          <Text
            style={[chatItemStyles.message, chat.unreadCount > 0 && chatItemStyles.messageActive]}
            numberOfLines={1}
          >
            {chat.lastMessage}
          </Text>
          {chat.unreadCount > 0 && (
            <View style={chatItemStyles.unreadBadge}>
              <Text style={chatItemStyles.unreadBadgeText}>{chat.unreadCount > 99 ? "99+" : chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}
