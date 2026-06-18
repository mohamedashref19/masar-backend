import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiCpu, FiSend } from "react-icons/fi";

export default function SmartChatWidget() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [text, setText] = useState("");

  // الحماية: يظهر الحاوية فقط وإذا كان الدور المسجل هو عميل (Client) لسلامة الـ Logic
  if (user?.role?.toLowerCase() !== "client") return null;

  // داخل ملف SmartChatWidget.jsx - تعديل دالة الـ handleSubmit:
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // 🎯 التوجيه وضخ الرسالة بالاسم الصحيح الموثق في الـ Page logic
    navigate("/ai-assistant", {
      state: { firstMessage: text },
    });
    setText("");
  };

  return (
    <div
      dir="rtl"
      className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 text-right font-sans"
    >
      <div className="bg-[#0D121A]/90 backdrop-blur-xl border border-white/[0.06] p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-72 md:w-80 relative overflow-hidden group">
        {/* خط إضاءة علوي متوهج */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />

        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 bg-secondary/10 border border-secondary/20 text-secondary text-sm rounded-lg flex items-center justify-center shadow-inner">
            <FiCpu className="group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <h4 className="text-white text-xs font-bold">
              مساعد مسار الذكي لايف
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5 font-light">
              أخبرني بفكرة مشروعك وسأقوم بصياغتها في التو واللحظة.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="مثال: أريد إنشاء متجر إلكتروني..."
            className="flex-1 bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none transition-colors text-right"
          />
          <button
            type="submit"
            className="bg-secondary text-slate-950 p-2.5 rounded-xl text-xs font-bold hover:bg-secondary/90 transition-all shadow-md shadow-secondary/5"
          >
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
}
