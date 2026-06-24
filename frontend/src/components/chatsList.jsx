import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./usersLoadingSkeleton";
import NoChatsFound from "./noChatsFound";
import { useAuthStore } from "../store/useAuthStore";

const formatChatTimestamp = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const getMessagePreview = (chat, authUserId) => {
  const latestMessage = chat.latestMessage || {};
  const text = latestMessage.text || chat.latestMessageText;
  const image = latestMessage.image || chat.latestMessageImage;
  const senderId =
    latestMessage.senderId?.toString?.() ||
    chat.latestMessageSenderId?.toString?.();
  const prefix = senderId === authUserId ? "You: " : "";

  if (text) return `${prefix}${text}`;
  if (image) return `${prefix}Photo`;
  return "No messages yet";
};

const ChatsList = () => {
  const {
    getMyChatPartners,
    chats,
    isChatsLoading,
    setSelectedUser,
    selectedUser,
  } = useChatStore();

  const { authUser, onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isChatsLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <button
          key={chat._id}
          disabled={selectedUser?._id === chat._id}
          onClick={() => setSelectedUser(chat)}
          className={`w-full p-4 flex items-center gap-3 hover:bg-slate-700/30 transition-all border-l-4 ${
            selectedUser?._id === chat._id
              ? "bg-slate-700/50 border-cyan-500"
              : "border-transparent"
          }`}
        >
          <div className="relative shrink-0">
            <img
              src={chat.profilePic || "/avatar.png"}
              alt={chat.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
            {onlineUsers.includes(chat._id) && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
            )}
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-white font-medium">{chat.fullName}</h4>
              <span className="text-xs text-slate-400">
                {formatChatTimestamp(chat.latestMessageAt)}
              </span>
            </div>
            <p className="text-sm text-slate-400 truncate">
              {getMessagePreview(chat, authUser?._id)}
            </p>
          </div>
          {chat.unreadCount > 0 && (
            <div className="shrink-0 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">
                {chat.unreadCount}
              </span>
            </div>
          )}
        </button>
      ))}
    </>
  );
};

export default ChatsList;
