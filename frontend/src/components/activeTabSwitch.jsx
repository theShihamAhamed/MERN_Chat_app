import { useChatStore } from "../store/useChatStore";
import { motion } from "framer-motion";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="relative flex bg-slate-800/60 p-1 rounded-xl m-2">
      {/* Sliding Indicator */}
      <motion.div
        className="absolute top-1 bottom-1 w-1/2 rounded-lg bg-cyan-500/20"
        animate={{
          x: activeTab === "chats" ? "0%" : "100%",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      />

      {/* Chats */}
      <button
        onClick={() => setActiveTab("chats")}
        className={`relative z-10 flex-1 py-2 text-sm font-medium transition-colors
          ${
            activeTab === "chats"
              ? "text-cyan-400"
              : "text-slate-400 hover:text-slate-200"
          }
        `}
      >
        Chats
      </button>

      {/* Contacts */}
      <button
        onClick={() => setActiveTab("contacts")}
        className={`relative z-10 flex-1 py-2 text-sm font-medium transition-colors
          ${
            activeTab === "contacts"
              ? "text-cyan-400"
              : "text-slate-400 hover:text-slate-200"
          }
        `}
      >
        Contacts
      </button>
    </div>
  );
}

export default ActiveTabSwitch;
