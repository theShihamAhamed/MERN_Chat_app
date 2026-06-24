import { io } from "socket.io-client";
import { SOCKET_BASE_URL } from "../lib/config";
import { useAuthStore } from "../store/useAuthStore";

export const initSocket = () => {
  const socket = io(SOCKET_BASE_URL, {
    withCredentials: true,
    transports: ["websocket"],
  });

  if (import.meta.env.MODE === "development") {
    socket.on("connect", () => console.info("Socket connected:", socket.id));
    socket.on("connect_error", (err) =>
      console.error("Socket connection error:", err.message)
    );
  }

  socket.on("getOnlineUsers", (userIds) =>
    useAuthStore.setState({ onlineUsers: userIds })
  );

  return socket;
};
