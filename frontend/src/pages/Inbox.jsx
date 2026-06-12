import { useState } from "react";
import { useSelector } from "react-redux";
import { useInbox } from "../features/chat/hooks/useInbox";
import { useChatWindow } from "../features/chat/hooks/useChatWindow";
import ChatSidebar from "../features/chat/components/ChatSidebar";
import ChatWindow from "../features/chat/components/ChatWindow";
import { FiMessageSquare } from "react-icons/fi";

export default function Inbox() {
  const [activeConversationId, setActiveConversationId] = useState(null);

  // سحب بيانات المستخدم المسجل حالياً لتحديد اتجاه فقاعات الشات
  const { user } = useSelector((state) => state.auth);

  const { data: inboxData, isLoading: isLoadingInbox } = useInbox();
  const { messages, sendNewMessage, isSending, isLoadingMessages } =
    useChatWindow(activeConversationId);

  const conversations = inboxData?.data?.conversations || inboxData || [];

  if (isLoadingInbox) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#080B10] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
        <span className="text-xs text-slate-500 font-medium">
          جاري مزامنة قنوات غرف المحادثات الحية...
        </span>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="container mx-auto mt-24 mb-6 px-4 max-w-6xl text-right relative selection:bg-secondary/30 font-['Outfit']"
    >
      {/* هالة إضاءة خلفية خفيفة خلف صندوق الشات */}
      <div className="absolute inset-0 bg-secondary/[0.01] blur-[100px] pointer-events-none rounded-2xl" />

      {/* شل الحاوية الرئيسي للشات العائم (Floating Glass Container) */}
      <div className="bg-[#0D121A] border border-white/[0.05] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[calc(100vh-8rem)] relative z-10">
        {/* 1. القائمة الجانبية للمحادثات (Sidebar) */}
        <div className="w-full md:w-80 border-l border-white/[0.05] bg-slate-950/20 flex flex-col shrink-0">
          <ChatSidebar
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={setActiveConversationId}
          />
        </div>

        {/* 2. نافذة المحادثة النشطة (Chat Window) */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-white/[0.01] to-transparent relative h-full">
          {!activeConversationId ? (
            // شاشة ترحيبية فخمة تظهر للعميل في البداية لو مفيش شات مفتوح
            <div className="flex-1 flex flex-col justify-center items-center text-center p-8 space-y-4">
              <div className="w-16 h-16 bg-secondary/10 border border-secondary/20 text-secondary rounded-2xl flex items-center justify-center text-2xl shadow-[0_8px_30px_rgba(228,255,0,0.05)] animate-bounce [animation-duration:3s]">
                <FiMessageSquare />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">
                  بوابة غرف المحادثات الآمنة
                </h3>
                <p className="text-slate-500 text-xs mt-1 max-w-sm leading-relaxed">
                  اختر أحد المستقلين أو العملاء من القائمة الجانبية لبدء نقاش
                  فني مأمن ومحمي بالكامل بضمان مسار.
                </p>
              </div>
            </div>
          ) : isLoadingMessages ? (
            // لودينج سحب الرسائل الداخلي
            <div className="flex-1 flex flex-col justify-center items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-secondary"></div>
              <span className="text-[10px] text-slate-500 font-medium">
                جاري فحص وتشفير حزمة الرسائل...
              </span>
            </div>
          ) : (
            // شاشة الشات الحية المكتملة
            <ChatWindow
              messages={messages}
              onSendMessage={sendNewMessage}
              isSending={isSending}
              activeId={activeConversationId}
              currentUserId={user?._id}
            />
          )}
        </div>
      </div>
    </div>
  );
}
