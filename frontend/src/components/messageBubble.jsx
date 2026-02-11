import { Clock, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

function MessageBubble({ msg }) {
  const { authUser } = useAuthStore();
  const isMe = msg.senderId === authUser._id;
  const isSending = msg.isOptimistic;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[70%] px-4 py-3 rounded-2xl wrap-break-word ${
          isMe
            ? "bg-cyan-600 text-white rounded-br-sm"
            : "bg-slate-800 text-slate-200 rounded-bl-sm"
        }`}
      >
        {/* IMAGE */}
        {msg.image && (
          <div className="relative mb-2">
            <img
              src={msg.image}
              alt="Shared"
              className={`rounded-lg max-h-48 w-full object-cover transition ${
                isSending ? "blur-sm opacity-70" : ""
              }`}
            />

            {/* Spinner overlay */}
            {isSending && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                <Loader2 className="size-6 animate-spin text-white" />
              </div>
            )}
          </div>
        )}

        {/* TEXT */}
        {msg.text && <p className="leading-relaxed">{msg.text}</p>}

        {/* TIME + STATUS */}
        <div className="flex items-center justify-end gap-1 text-xs mt-1 text-white/70">
          <span>
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isSending && <Clock className="size-3 animate-pulse" />}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
