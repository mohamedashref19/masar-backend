import { useState, useEffect, useRef } from "react";
import { Button } from "../../../components";
import { FiSend, FiCpu } from "react-icons/fi";

export default function ChatWindow({
  messages,
  onSendMessage,
  isSending,
  activeId,
  currentUserId,
}) {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // السكرول التلقائي المأمن لأسفل الشات مع كل رسالة جديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage({ conversationId: activeId, content: text.trim() });
    setText("");
  };

  return (
    <div
      dir="rtl"
      className="flex-1 flex flex-col h-full bg-transparent text-right"
    >
      {/* منطقة دفق وسحب الرسائل الحية */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-950/10 scrollbar-thin scrollbar-thumb-white/5">
        {messages.map((msg) => {
          const senderId = msg.sender?._id || msg.sender;
          const isMe = String(senderId) === String(currentUserId);

          return (
            <div
              key={msg._id}
              // 🎯 اليوزر الحالي (رسائلي) تفرش يسار الشاشة والطرف الآخر يمين الشاشة لتناسق عربي فائق الـ UX
              className={`flex ${isMe ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-1 duration-150`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-2xl p-3.5 shadow-xl border transition-all ${
                  isMe
                    ? "bg-secondary border-secondary/20 text-slate-950 font-bold rounded-bl-none shadow-secondary/5"
                    : "bg-slate-950/60 backdrop-blur-md border-white/[0.04] text-slate-200 rounded-br-none"
                }`}
              >
                <p className="text-xs md:text-sm leading-relaxed font-light">
                  {msg.content}
                </p>
                <span
                  className={`block text-[9px] mt-1 font-mono ${
                    isMe
                      ? "text-slate-950/60 text-right"
                      : "text-slate-500 text-left"
                  }`}
                  dir="ltr"
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* صندوق إدخال وإرسال الرسائل السفلي */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-slate-950/40 backdrop-blur-md border-t border-white/[0.05] flex gap-3"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب ردك ومقترحك الفني هنا..."
          className="flex-1 bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none transition-colors text-right"
        />
        <Button
          type="submit"
          variant="accent"
          className="px-5 py-3 rounded-xl font-bold text-xs md:text-sm text-slate-950 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 shrink-0"
          disabled={isSending || !text.trim()}
        >
          {isSending ? (
            <span className="w-4 h-4 border-2 border-t-transparent border-slate-950 rounded-full animate-spin" />
          ) : (
            <>
              <FiSend className="rotate-180" /> {/* قلب اتجاه السهم للـ RTL */}
              <span>إرسال</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
