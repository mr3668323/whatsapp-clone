export interface ChatMessage {
  id: string
  text: string
  isOwn: boolean
  timestamp: string
  type?: "message" | "date" | "system" | "card"
}

export const dummyConversations: Record<string, ChatMessage[]> = {
  // Ahmed - simple greeting + photos
  "1": [
    {
      id: "1",
      text: "Hey! Long time no see 😊",
      isOwn: false,
      timestamp: "2:10 PM",
      type: "message",
    },
    {
      id: "2",
      text: "I just came back from a trip and took some awesome photos!",
      isOwn: false,
      timestamp: "2:12 PM",
      type: "message",
    },
    {
      id: "3",
      text: "Wow, really? Can't wait to see them!",
      isOwn: true,
      timestamp: "2:13 PM",
      type: "message",
    },
    {
      id: "4",
      text: "📷 4 photos",
      isOwn: false,
      timestamp: "2:15 PM",
      type: "message",
    },
  ],

  // WhatsApp official account - status question stickers card
  "2": [
    {
      id: "d1",
      text: "December 14, 2025",
      isOwn: false,
      timestamp: "",
      type: "date",
    },
    {
      id: "d2",
      text: "December 24, 2025",
      isOwn: false,
      timestamp: "",
      type: "date",
    },
    {
      id: "3",
      text: "New: Ask anything with status question stickers 💭",
      isOwn: false,
      timestamp: "9:47 PM",
      type: "card",
    },
    {
      id: "4",
      text:
        "Just tap the sticker icon when you're creating a status, then choose Question. " +
        "See everyone's answers in one place, reply directly, and share any response to your status to keep the fun going.",
      isOwn: false,
      timestamp: "9:47 PM",
      type: "message",
    },
    {
      id: "5",
      text: "Get started",
      isOwn: false,
      timestamp: "9:47 PM",
      type: "message",
    },
  ],

  // Ali - live location + greetings
  "3": [
    {
      id: "d1",
      text: "September 16, 2025",
      isOwn: false,
      timestamp: "",
      type: "date",
    },
    {
      id: "sys1",
      text: "Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them. Learn more.",
      isOwn: false,
      timestamp: "",
      type: "system",
    },
    {
      id: "d2",
      text: "December 14, 2025",
      isOwn: false,
      timestamp: "",
      type: "date",
    },
    {
      id: "1",
      text: "Hello",
      isOwn: true,
      timestamp: "1:13 PM",
      type: "message",
    },
    {
      id: "2",
      text: "📍 Live location ended",
      isOwn: true,
      timestamp: "1:14 PM",
      type: "message",
    },
    {
      id: "3",
      text: "Han",
      isOwn: false,
      timestamp: "1:14 PM",
      type: "message",
    },
  ],
}

