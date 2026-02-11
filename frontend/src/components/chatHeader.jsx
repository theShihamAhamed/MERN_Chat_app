import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div className="flex items-center justify-between px-6 h-21 border-b border-slate-700/50 bg-slate-800/50">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* AVATAR */}
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700"
          />

          {/* ONLINE / OFFLINE DOT */}
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
              isOnline ? "bg-green-500" : "bg-slate-500"
            }`}
          />
        </div>

        {/* USER INFO */}
        <div>
          <h3 className="text-slate-200 font-medium leading-tight">
            {selectedUser.fullName}
          </h3>
          <p className="text-sm text-slate-400">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setSelectedUser(null)}
        className="text-slate-400 hover:text-slate-200 transition-colors"
        aria-label="Close chat"
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
export default ChatHeader;
