import { User, Message, Chat } from "../types/chat";

export const mockUsers = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    online: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    online: false,
    lastSeen: "2 hours ago",
  },
  {
    id: "3",
    name: "Emma Davis",
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
    online: true,
  },
  {
    id: "4",
    name: "James Wilson",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
    online: false,
    lastSeen: "5 hours ago",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    online: true,
  },
];

export const mockChats = [
  {
    userId: "1",
    lastMessage: "Hey! How are you doing?",
    timestamp: "2:30 PM",
    unread: 2,
  },
  {
    userId: "3",
    lastMessage: "Thanks for your help yesterday!",
    timestamp: "1:45 PM",
  },
  {
    userId: "2",
    lastMessage: "See you tomorrow!",
    timestamp: "Yesterday",
  },
];

export const mockMessages = {
  1: [
    {
      id: "m1",
      userId: "1",
      text: "Hi there! How have you been?",
      timestamp: "2:15 PM",
      sent: false,
    },
    {
      id: "m2",
      userId: "me",
      text: "I've been great! Working on some new projects.",
      timestamp: "2:18 PM",
      sent: true,
    },
    {
      id: "m3",
      userId: "1",
      text: "That sounds exciting! What kind of projects?",
      timestamp: "2:20 PM",
      sent: false,
    },
    {
      id: "m4",
      userId: "me",
      text: "Building a new chat application with React and Tailwind.",
      timestamp: "2:25 PM",
      sent: true,
    },
    {
      id: "m5",
      userId: "1",
      text: "Hey! How are you doing?",
      timestamp: "2:30 PM",
      sent: false,
    },
  ],
  2: [
    {
      id: "m6",
      userId: "2",
      text: "Did you finish the presentation?",
      timestamp: "Yesterday",
      sent: false,
    },
    {
      id: "m7",
      userId: "me",
      text: "Yes! Just submitted it this morning.",
      timestamp: "Yesterday",
      sent: true,
    },
    {
      id: "m8",
      userId: "2",
      text: "See you tomorrow!",
      timestamp: "Yesterday",
      sent: false,
    },
  ],
  3: [
    {
      id: "m9",
      userId: "3",
      text: "Could you help me with the code review?",
      timestamp: "1:20 PM",
      sent: false,
    },
    {
      id: "m10",
      userId: "me",
      text: "Sure! Let me take a look at it now.",
      timestamp: "1:30 PM",
      sent: true,
    },
    {
      id: "m11",
      userId: "3",
      text: "Thanks for your help yesterday!",
      timestamp: "1:45 PM",
      sent: false,
    },
  ],
};

export const currentUser = {
  id: "me",
  name: "Alex Morgan",
  avatar:
    "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150",
  online: true,
};
