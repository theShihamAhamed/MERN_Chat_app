import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./usersLoadingSkeleton";
import NoChatsFound from "./noChatsFound";
import { useAuthStore } from "../store/useAuthStore";

const ChatsList = () => {
  const {
    getMyChatPartners,
    chats,
    isUsersLoading,
    setSelectedUser,
    selectedUser,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
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
                {chat.timestamp || "2.30 PM"}
              </span>
            </div>
            <p className="text-sm text-slate-400 truncate">
              {chat.lastMessage || "Hey! How are you doing?"}
            </p>
          </div>
          {
            <div className="shrink-0 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">
                {chat.unread || "5"}
              </span>
            </div>
          }
        </button>
      ))}
    </>
  );
};

export default ChatsList;
