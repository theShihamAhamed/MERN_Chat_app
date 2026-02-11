import React from "react";
import { useChatStore } from "../store/useChatStore";
import ActiveTabSwitch from "../components/activeTabSwitch";
import ProfileHeader from "../components/profileHeader";
import ChatsList from "../components/chatsList";
import ContactList from "../components/contactList";
import ChatContainer from "../components/chatContainer";
import NoConversationPlaceholder from "../components/noConversationPlaceholder";

const ChatPage = () => {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <>
      {/* LEFT SIDE */}
      <div className="w-80 flex flex-col">
        <ProfileHeader />
        <ActiveTabSwitch />

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </>
  );
};

export default ChatPage;
