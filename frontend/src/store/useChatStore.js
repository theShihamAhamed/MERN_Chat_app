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
  isContactsLoading: false,
  isChatsLoading: false,
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
    set({ isContactsLoading: true, isUsersLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      const contacts = Array.isArray(res.data?.filteredUsers)
        ? res.data.filteredUsers
        : [];

      set({ allContacts: contacts });
      return { ...res.data, filteredUsers: contacts };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch contacts";

      set({ error: message, allContacts: [] });
      toast.error(message);
      throw error;
    } finally {
      set({ isContactsLoading: false, isUsersLoading: false });
    }
  },

  getMyChatPartners: async (options = {}) => {
    const { silent = false } = options;

    if (!silent) {
      set({ isChatsLoading: true, isUsersLoading: true, error: null });
    }

    try {
      const res = await axiosInstance.get("/messages/chats");
      const chatPartners = Array.isArray(res.data?.chatPartners)
        ? res.data.chatPartners
        : [];

      set({ chats: chatPartners });
      return { ...res.data, chatPartners };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch chats";

      set({ error: message });
      if (!silent) toast.error(message);
      throw error;
    } finally {
      if (!silent) {
        set({ isChatsLoading: false, isUsersLoading: false });
      }
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      const messages = Array.isArray(res.data?.messages)
        ? res.data.messages
        : [];

      set({ messages });
      return { ...res.data, messages };
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

      set((state) => {
        const messages = state.messages.map((msg) =>
          msg._id === tempId ? res.data.newMessage : msg
        );

        return { messages, activeTab: "chats" };
      });

      await get().getMyChatPartners({ silent: true }).catch(() => {});

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

    const existingHandler = get()._messageHandler;
    const existingSocket = get()._messageSocket;

    if (existingSocket && existingHandler) {
      existingSocket.off("newMessage", existingHandler);
    }

    const handler = (newMessage) => {
      const { authUser } = useAuthStore.getState();
      const { selectedUser, isSoundEnabled } = get();
      const isSelectedConversation =
        selectedUser &&
        authUser &&
        ((newMessage.senderId === selectedUser._id &&
          newMessage.receiverId === authUser._id) ||
          (newMessage.senderId === authUser._id &&
            newMessage.receiverId === selectedUser._id));

      if (isSelectedConversation) {
        set((state) => {
          const alreadyExists = state.messages.some(
            (msg) => msg._id === newMessage._id
          );

          return alreadyExists
            ? {}
            : { messages: [...state.messages, newMessage] };
        });

        if (isSoundEnabled) {
          const audio = new Audio("/sounds/notification.mp3");
          audio.play().catch(() => {});
        }
      }

      get().getMyChatPartners({ silent: true }).catch(() => {});
    };

    socket.on("newMessage", handler);

    set({ _messageHandler: handler, _messageSocket: socket });
  },

  unsubscribeFromMessages: () => {
    const handler = get()._messageHandler;
    const socket = get()._messageSocket || useAuthStore.getState().socket;

    if (socket && handler) {
      socket.off("newMessage", handler);
    }

    set({ _messageHandler: null, _messageSocket: null });
  },
}));
