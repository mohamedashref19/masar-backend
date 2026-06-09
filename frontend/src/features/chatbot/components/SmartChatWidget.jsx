import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function SmartChatWidget() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [text, setText] = useState("");

  // 🎯 الحماية: يظهر فقط إذا كان المستخدم مسجل دخوله كـ Client
  if (user?.role !== "client") return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // التوجيه لصفحة الشات الكاملة وتمرير أول رسالة كتبها العميل
    navigate("/ai-assistant", { state: { firstMessage: text } });
    setText("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl shadow-2xl w-72 md:w-80">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🤖</span>
          <div>
            <h4 className="text-white text-xs font-bold">مساعد مسار الذكي</h4>
            <p className="text-[10px] text-slate-400">
              اخبرني بمشروعك وسأقوم بصياغته فوراً
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="أريد إنشاء تطبيق فلاتر..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary text-right"
          />
          <button
            type="submit"
            className="bg-secondary text-slate-900 p-2 rounded-xl text-xs font-bold hover:bg-secondary/90 transition-colors"
          >
            إرسال
          </button>
        </form>
      </div>
    </div>
  );
}
