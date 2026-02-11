import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { initSocket } from "../utils/socket";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,

  isCheckingAuth: false,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  error: null,

  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const res = await axiosInstance.get("/auth/profile");
      set({ authUser: res.data.user });

      get().connectSocket();
      return res.data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        set({ authUser: null });

        return null;
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch profile";

      if (import.meta.env.MODE === "development") {
        console.error("checkAuth failed:", message);
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true, error: null });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.user });
      toast.success("Account created successfully!");
      get().connectSocket();
      return res.data.user;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Signup failed";
      set({ error: message });
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true, error: null });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user });
      toast.success("Logged in successfully");

      const socket = initSocket(res.data.token);
      set({ socket });

      return res.data.user;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      set({ error: message });
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Logout failed";
      toast.error(message);
      if (import.meta.env.MODE === "development") {
        console.error("Logout error:", message);
      }
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true, error: null });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data.updatedUser });
      toast.success("Profile updated successfully");
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();

    console.log("authUser", authUser);
    console.log("get().socket", get().socket);

    if (!authUser || get().socket) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.connect();

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
