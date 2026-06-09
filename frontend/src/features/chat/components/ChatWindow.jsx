import { useState, useEffect, useRef } from "react";
import { Button } from "../../../components";

export default function ChatWindow({
  messages,
  onSendMessage,
  isSending,
  activeId,
  currentUserId,
}) {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // عمل Scroll للأسفل تلقائياً مع وصول رسائل جديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage({ conversationId: activeId, content: text.trim() });
    setText("");
  };

  if (!activeId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-primary/20">
        <span className="text-5xl mb-4">💬</span>
        <p>اختر محادثة من القائمة الجانبية لبدء الشات</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-5rem)] bg-primary/10">
      {/* منطقة الرسائل */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          // 🎯 التحقق الذكي من هوية المرسل (سواء الباك إند بعته كـ ID مباشر أو كـ Object جواه الـ _id)
          const senderId = msg.sender?._id || msg.sender;
          const isMe = String(senderId) === String(currentUserId);

          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md rounded-2xl p-4 shadow-md transition-all ${
                  isMe
                    ? "bg-secondary text-white rounded-br-none" // 🟢 رسائلك: على اليمين بلون الـ Accent/Secondary
                    : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/50" // ⚪ رسائل الطرف الآخر: على الشمال بلون داكن متناسق
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <span
                  className={`block text-[10px] mt-1 ${isMe ? "text-slate-200/70 text-left" : "text-slate-400 text-right"}`}
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

      {/* صندوق الإدخال */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-slate-900/60 border-t border-slate-800 flex gap-3"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-secondary transition-all"
        />
        <Button
          type="submit"
          variant="accent"
          className="px-6"
          disabled={isSending}
        >
          {isSending ? "جاري..." : "إرسال"}
        </Button>
      </form>
    </div>
  );
}
