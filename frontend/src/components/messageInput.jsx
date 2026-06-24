import { useRef, useState } from "react";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";
import useKeyboardSound from "../hooks/useKeyboardSound";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const { sendMessage, isSoundEnabled, isSendingMessage } = useChatStore();

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (isSendingMessage || (!text.trim() && !imagePreview)) return;

    if (isSoundEnabled) playRandomKeyStrokeSound();

    const nextMessage = {
      text: text.trim(),
      image: imagePreview,
    };

    try {
      await sendMessage(nextMessage);
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      // The store shows the toast; keep the draft so the user can retry.
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.onerror = () => toast.error("Could not read the selected image");
    reader.readAsDataURL(file);
  };

  return (
    <div className="border-t border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 rounded-xl object-cover ring-1 ring-slate-700"
            />
            <button
              type="button"
              onClick={() => setImagePreview(null)}
              className="absolute -top-2 -right-2 size-6 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition"
            >
              <XIcon className="size-4" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex items-center gap-3"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              isSoundEnabled && playRandomKeyStrokeSound();
            }}
            placeholder="Type a message..."
            disabled={isSendingMessage}
            className="w-full rounded-xl bg-slate-800/60 px-4 py-3 text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition disabled:opacity-60"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSendingMessage}
          className={`size-11 flex items-center justify-center rounded-xl bg-slate-800/60 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition ${
            imagePreview ? "text-cyan-400" : ""
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <ImageIcon className="size-5" />
        </button>

        <button
          type="submit"
          disabled={isSendingMessage || (!text.trim() && !imagePreview)}
          className="size-11 flex items-center justify-center rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label={isSendingMessage ? "Sending message" : "Send message"}
        >
          <SendIcon className="size-5" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
