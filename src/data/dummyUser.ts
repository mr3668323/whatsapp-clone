export interface ChatUser {
  id: string
  name: string
  message: string
  time: string
  unreadCount?: number
  isMuted?: boolean
  isStatus?: boolean
}

export const dummyUserChats: ChatUser[] = [
  {
    id: "1",
    name: "Ahmed",
    message: "📷 4 photos",
    time: "2:15 PM",
    isStatus: true,
  },
  {
    id: "2",
    name: "WhatsApp",
    message: "📹 New: Ask anything with status…",
    time: "12/24/25",
    unreadCount: 2,
  },
  {
    id: "3",
    name: "Ali",
    message: "📍 Live location",
    time: "12/14/25",
  },
]

