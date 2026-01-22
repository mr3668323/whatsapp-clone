import type React from "react"
import { useMemo, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { chatDetailScreenStyles } from "../styles/ChatDetailScreen.styles"
import { colors } from "../../../styles/colors"
import { dummyConversations, type ChatMessage } from "../../../data/dummyConversations"
import type { RootStackParamList } from "../../../types/navigation"

type ChatDetailScreenProps = NativeStackScreenProps<RootStackParamList, "ChatDetail">

export const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({ route, navigation }) => {
  const { chatId, chatName } = route.params

  // Check if this is WhatsApp official account (read-only)
  const isWhatsAppOfficial = chatId === "2"

  const initialMessages: ChatMessage[] = useMemo(() => {
    return dummyConversations[chatId] ?? [
      {
        id: "1",
        text: `You started a new chat with ${chatName}`,
        isOwn: false,
        timestamp: "10:00 AM",
        type: "system",
      },
    ]
  }, [chatId, chatName])

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [messageText, setMessageText] = useState("")

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: ChatMessage = {
        id: `${messages.length + 1}`,
        text: messageText,
        isOwn: true,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        type: "message",
      }
      setMessages([...messages, newMessage])
      setMessageText("")
    }
  }

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    if (item.type === "date") {
      return (
        <View style={chatDetailScreenStyles.dateContainer}>
          <Text style={chatDetailScreenStyles.dateText}>{item.text}</Text>
        </View>
      )
    }

    if (item.type === "system") {
      return (
        <View style={chatDetailScreenStyles.systemContainer}>
          <Text style={chatDetailScreenStyles.systemIcon}>🔒</Text>
          <Text style={chatDetailScreenStyles.systemText}>{item.text}</Text>
        </View>
      )
    }

    const isOwn = item.isOwn

    // Card-style message (for WhatsApp official account)
    if (item.type === "card") {
      return (
        <View style={chatDetailScreenStyles.cardWrapper}>
          <View style={chatDetailScreenStyles.cardBubble}>
            <View style={chatDetailScreenStyles.cardMedia}>
              <View style={chatDetailScreenStyles.cardPlayButton}>
                <Text style={{ color: colors.textLight, fontSize: 18 }}>▶</Text>
              </View>
            </View>
            <Text style={chatDetailScreenStyles.cardTitle}>{item.text}</Text>
          </View>
          {item.timestamp ? <Text style={chatDetailScreenStyles.messageTime}>{item.timestamp}</Text> : null}
        </View>
      )
    }

    return (
      <View
        style={[
          chatDetailScreenStyles.messageRow,
          isOwn ? chatDetailScreenStyles.messageRowOwn : chatDetailScreenStyles.messageRowOther,
        ]}
      >
        <View
          style={[
            chatDetailScreenStyles.messageBubble,
            isOwn ? chatDetailScreenStyles.ownMessage : chatDetailScreenStyles.otherMessage,
          ]}
        >
          <Text
            style={[
              chatDetailScreenStyles.messageText,
              isOwn && chatDetailScreenStyles.messageTextOwn,
            ]}
          >
            {item.text}
          </Text>
          {isOwn && (
            <View style={chatDetailScreenStyles.messageFooter}>
              <Text style={chatDetailScreenStyles.messageTimeInline}>{item.timestamp}</Text>
              <Text style={chatDetailScreenStyles.checkmarkIcon}>✓✓</Text>
            </View>
          )}
          {!isOwn && item.timestamp && (
            <Text style={chatDetailScreenStyles.messageTimeInline}>{item.timestamp}</Text>
          )}
        </View>
      </View>
    )
  }

  return (
    <ImageBackground
      source={require("../../../assets/images/background.jpg")}
      style={chatDetailScreenStyles.container}
      imageStyle={{ opacity: 0.1 }}
    >
      <SafeAreaView style={chatDetailScreenStyles.container}>
        {/* Header */}
        <View style={chatDetailScreenStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={chatDetailScreenStyles.backButton}>
            <Text style={chatDetailScreenStyles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={chatDetailScreenStyles.headerInfo}>
            <Text style={chatDetailScreenStyles.headerTitle}>{chatName}</Text>
            {isWhatsAppOfficial && (
              <Text style={chatDetailScreenStyles.headerSubtitle}>Official WhatsApp Account</Text>
            )}
          </View>
          <View style={chatDetailScreenStyles.headerActions}>
            <TouchableOpacity style={chatDetailScreenStyles.headerIcon}>
              <Text style={chatDetailScreenStyles.headerIconText}>📹</Text>
            </TouchableOpacity>
            <TouchableOpacity style={chatDetailScreenStyles.headerIcon}>
              <Text style={chatDetailScreenStyles.headerIconText}>☎️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={chatDetailScreenStyles.headerIcon}>
              <Text style={chatDetailScreenStyles.headerIconText}>⋮</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={chatDetailScreenStyles.messagesContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Input - Only show if not WhatsApp official account */}
        {!isWhatsAppOfficial && (
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={chatDetailScreenStyles.inputContainer}>
              <TouchableOpacity style={chatDetailScreenStyles.emojiButton}>
                <Text style={chatDetailScreenStyles.emojiIcon}>😊</Text>
              </TouchableOpacity>
              <View style={chatDetailScreenStyles.inputWrapper}>
                <TextInput
                  style={chatDetailScreenStyles.input}
                  placeholder="Message"
                  placeholderTextColor={colors.textTertiary}
                  value={messageText}
                  onChangeText={setMessageText}
                  multiline
                />
              </View>
              {messageText.trim() ? (
                <TouchableOpacity onPress={handleSendMessage} style={chatDetailScreenStyles.sendButton}>
                  <Text style={chatDetailScreenStyles.sendIcon}>➤</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity style={chatDetailScreenStyles.attachButton}>
                    <Text style={chatDetailScreenStyles.attachIcon}>📎</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={chatDetailScreenStyles.cameraButton}>
                    <Text style={chatDetailScreenStyles.cameraIcon}>📷</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={chatDetailScreenStyles.micButton}>
                    <Text style={chatDetailScreenStyles.micIcon}>🎤</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </KeyboardAvoidingView>
        )}
        {/* Read-only message for WhatsApp */}
        {isWhatsAppOfficial && (
          <View style={chatDetailScreenStyles.readOnlyContainer}>
            <Text style={chatDetailScreenStyles.readOnlyText}>Only WhatsApp can send messages</Text>
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  )
}
