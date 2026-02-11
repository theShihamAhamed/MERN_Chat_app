import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  selectedUser: null,
  activeTab: "chats",

  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,

  error: null,

  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    const next = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", next);
    set({ isSoundEnabled: next });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  getAllContacts: async () => {
    set({ isUsersLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch contacts";

      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data.chatPartners });
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch chats";

      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data.messages });
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch messages";

      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    const { authUser } = useAuthStore.getState();

    if (!selectedUser) return;

    set({ isSendingMessage: true, error: null });

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set((state) => ({
      messages: [...state.messages, optimisticMessage],
    }));

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempId ? res.data.newMessage : msg
        ),
      }));

      return res.data.newMessage;
    } catch (error) {
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempId),
      }));

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to send message";

      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ isSendingMessage: false });
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    const handler = (newMessage) => {
      console.log("newMessage", newMessage);
      const { selectedUser, isSoundEnabled } = get();
      if (!selectedUser || newMessage.senderId !== selectedUser._id) return;

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));

      if (isSoundEnabled) {
        const audio = new Audio("/sounds/notification.mp3");
        audio.play().catch(() => {});
      }
    };

    socket.on("newMessage", handler);

    // store handler reference
    set({ _messageHandler: handler });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    const handler = get()._messageHandler;

    if (socket && handler) {
      socket.off("newMessage", handler);
    }
  },
}));
