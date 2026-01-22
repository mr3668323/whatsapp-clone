export interface Status {
  id: string;
  name: string;
  avatar: string;
  time: string;
  hasNewStatus: boolean;
  hasSeen?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  lastUpdate: string;
  lastMessage: string;
  isVerified: boolean;
  isMuted?: boolean;
  hasUnread?: boolean;
  messageType?: 'text' | 'image' | 'video' | 'link';
}

export const dummyStatuses: Status[] = [
  {
    id: '1',
    name: 'My Status',
    avatar: '👤',
    time: 'Tap to add status update',
    hasNewStatus: false,
    hasSeen: true,
  },
  {
    id: '2',
    name: 'WhatsApp',
    avatar: '💚',
    time: 'Just now',
    hasNewStatus: true,
    hasSeen: false,
  },
  {
    id: '3',
    name: 'Rafi',
    avatar: '👨',
    time: 'Just now',
    hasNewStatus: true,
    hasSeen: false,
  },
  {
    id: '4',
    name: 'John',
    avatar: '👨‍💼',
    time: '32 minutes ago',
    hasNewStatus: true,
    hasSeen: false,
  },
  {
    id: '5',
    name: 'Sarah',
    avatar: '👩',
    time: '1 hour ago',
    hasNewStatus: true,
    hasSeen: false,
  },
  {
    id: '6',
    name: 'Mike',
    avatar: '🧔',
    time: '2 hours ago',
    hasNewStatus: true,
    hasSeen: false,
  },
];

export const dummyChannels: Channel[] = [
  {
    id: '1',
    name: 'Samaa TV',
    lastUpdate: '4:23 PM',
    lastMessage: 'Watch Here: https://youtu.be/mX...',
    isVerified: true,
    isMuted: false,
    hasUnread: true,
    messageType: 'link',
  },
  {
    id: '2',
    name: 'Real Madrid C.F.',
    lastUpdate: '4:22 PM',
    lastMessage: 'UP FOR THE CUP! 😉 ¡A POR L...',
    isVerified: true,
    isMuted: false,
    hasUnread: true,
    messageType: 'text',
  },
  {
    id: '3',
    name: 'A Sports',
    lastUpdate: '2:54 PM',
    lastMessage: 'Virat Kohli claims No.1 spot in ...',
    isVerified: true,
    isMuted: true,
    hasUnread: true,
    messageType: 'text',
  },
  {
    id: '4',
    name: 'FC Barcelona',
    lastUpdate: '11:30 AM',
    lastMessage: 'Cancelo is back where he be...',
    isVerified: true,
    isMuted: false,
    hasUnread: false,
    messageType: 'text',
  },
  {
    id: '5',
    name: 'Geo News',
    lastUpdate: '10:15 AM',
    lastMessage: 'Breaking: Major announcement today',
    isVerified: true,
    isMuted: false,
    hasUnread: false,
    messageType: 'text',
  },
];