const isDevelopment = import.meta.env.MODE === "development";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (isDevelopment ? "http://localhost:5000/api" : "/api");

export const SOCKET_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (isDevelopment ? "http://localhost:5000" : "/");
