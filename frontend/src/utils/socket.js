import { io } from "socket.io-client";
import { useAuthStore } from "../store/useAuthStore";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const initSocket = (token) => {
  const socket = io(BASE_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
  socket.on("connect_error", (err) =>
    console.error("Socket connection error:", err.message)
  );

  socket.on("getOnlineUsers", (userIds) =>
    useAuthStore.setState({ onlineUsers: userIds })
  );

  return socket;
};
