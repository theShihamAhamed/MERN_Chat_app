import { useEffect } from "react";
import { UsersIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./usersLoadingSkeleton";

const ContactList = () => {
  const {
    allContacts,
    getAllContacts,
    isContactsLoading,
    selectedUser,
    setSelectedUser,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts().catch(() => {});
  }, [getAllContacts]);

  if (isContactsLoading) return <UsersLoadingSkeleton />;

  if (!Array.isArray(allContacts) || allContacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
        <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
          <UsersIcon className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h4 className="text-slate-200 font-medium mb-1">
            No contacts found
          </h4>
          <p className="text-slate-400 text-sm px-6">
            When other users join, they will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {allContacts.map((contact) => {
        const isSelected = selectedUser?._id === contact._id;
        const isOnline = onlineUsers.includes(contact._id);

        return (
          <button
            key={contact._id}
            disabled={isSelected}
            onClick={() => setSelectedUser(contact)}
            className={`w-full p-4 flex items-center gap-3 hover:bg-slate-700/30 transition-all border-l-4 ${
              isSelected
                ? "bg-slate-700/50 border-cyan-500"
                : "border-transparent"
            }`}
          >
            <div className="relative shrink-0">
              <img
                src={contact.profilePic || "/avatar.png"}
                alt={contact.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800 ${
                  isOnline ? "bg-green-500" : "bg-slate-500"
                }`}
              />
            </div>

            <div className="flex-1 text-left overflow-hidden">
              <h4 className="text-white font-medium truncate">
                {contact.fullName}
              </h4>
              <p className="text-sm text-slate-400 truncate">
                {contact.email || (isOnline ? "Online" : "Offline")}
              </p>
            </div>
          </button>
        );
      })}
    </>
  );
};

export default ContactList;
