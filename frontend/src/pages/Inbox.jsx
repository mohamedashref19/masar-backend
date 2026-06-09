import { useState } from "react";
import { useSelector } from "react-redux"; // 🎯 1. استيراد useSelector
import { useInbox } from "../features/chat/hooks/useInbox";
import { useChatWindow } from "../features/chat/hooks/useChatWindow";
import ChatSidebar from "../features/chat/components/ChatSidebar";
import ChatWindow from "../features/chat/components/ChatWindow";

export default function Inbox() {
  const [activeConversationId, setActiveConversationId] = useState(null);

  // 🎯 2. سحب بيانات المستخدم المسجل حالياً
  const { user } = useSelector((state) => state.auth);

  const { data: inboxData, isLoading: isLoadingInbox } = useInbox();
  const { messages, sendNewMessage, isSending, isLoadingMessages } =
    useChatWindow(activeConversationId);

  const conversations = inboxData?.data?.conversations || inboxData || [];

  if (isLoadingInbox) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] mt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-16 bg-primary border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[calc(100vh-5rem)]">
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
      />

      {isLoadingMessages ? (
        <div className="flex-1 flex justify-center items-center bg-primary/20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-secondary"></div>
        </div>
      ) : (
        <ChatWindow
          messages={messages}
          onSendMessage={sendNewMessage}
          isSending={isSending}
          activeId={activeConversationId}
          currentUserId={user?._id} // 🎯 3. تمرير الـ ID للنافذة
        />
      )}
    </div>
  );
}
