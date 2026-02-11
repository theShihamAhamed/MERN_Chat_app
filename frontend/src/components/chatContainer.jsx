import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import MessagesLoadingSkeleton from "./messagesLoadingSkeleton";
import NoChatHistoryPlaceholder from "./noChatHistoryPlaceholder";
import ChatHeader from "./chatHeader";
import MessageInput from "./messageInput";
import MessageBubble from "./messageBubble";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const lastSelectedUserId = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [
    selectedUser,
    getMessagesByUserId,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;

    // Switching chats → jump instantly
    if (lastSelectedUserId.current !== selectedUser._id) {
      el.scrollTop = el.scrollHeight;
      lastSelectedUserId.current = selectedUser._id;
      return;
    }

    // New message → smooth scroll
    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, selectedUser._id]);

  return (
    <>
      <ChatHeader />
      <div
        className="flex-1 px-6 py-6 overflow-y-auto custom-scrollbar"
        ref={containerRef}
      >
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length === 0 ? (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg._id} msg={msg} />
            ))}
          </div>
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;
