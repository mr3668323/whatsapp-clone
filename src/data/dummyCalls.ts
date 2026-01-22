export interface CallLog {
  id: string
  name: string
  type: "incoming" | "outgoing" | "missed"
  time: string
  duration?: string
  avatar: string
  date?: string
  videoCall?: boolean
}

export const dummyCalls: CallLog[] = [
  {
    id: "1",
    name: "John Doe",
    type: "incoming",
    time: "10:30 AM",
    duration: "2m 15s",
    avatar: "👨",
    date: "Today",
    videoCall: false,
  },
  {
    id: "2",
    name: "Sarah Smith",
    type: "outgoing",
    time: "9:45 AM",
    duration: "5m 30s",
    avatar: "👩",
    date: "Today",
    videoCall: true,
  },
  {
    id: "3",
    name: "Mike Johnson",
    type: "missed",
    time: "8:20 AM",
    avatar: "👨‍💼",
    date: "Today",
    videoCall: false,
  },
  {
    id: "4",
    name: "Emma Wilson",
    type: "incoming",
    time: "Yesterday",
    duration: "10m 45s",
    avatar: "👩‍🎨",
    date: "Yesterday",
    videoCall: true,
  },
  {
    id: "5",
    name: "David Brown",
    type: "outgoing",
    time: "2 days ago",
    duration: "3m",
    avatar: "👨‍💻",
    date: "2 days ago",
    videoCall: false,
  },
  {
    id: "6",
    name: "Lisa Taylor",
    type: "incoming",
    time: "3 days ago",
    duration: "7m 20s",
    avatar: "👩‍🏫",
    date: "3 days ago",
    videoCall: false,
  },
  {
    id: "7",
    name: "Robert Wilson",
    type: "missed",
    time: "4 days ago",
    avatar: "👨‍🔬",
    date: "4 days ago",
    videoCall: true,
  },
  {
    id: "8",
    name: "Maria Garcia",
    type: "outgoing",
    time: "Last week",
    duration: "12m",
    avatar: "👩‍🍳",
    date: "Last week",
    videoCall: false,
  },
]