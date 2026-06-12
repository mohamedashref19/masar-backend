import { useSmartChatPage } from "../features/chatbot/hooks/useSmartChatPage";
import { Button } from "../components";
import ReactMarkdown from "react-markdown";
import { FiCpu, FiSend, FiRefreshCw, FiCheckCircle } from "react-icons/fi";

export default function SmartChatPage() {
  const {
    messages,
    inputText,
    setInputText,
    isTyping,
    isDataReady,
    lastFailedMessage,
    handleRetry,
    messagesEndRef,
    handleSendMessage,
    handleProceedToPost,
  } = useSmartChatPage();

  return (
    <div
      dir="rtl"
      className="container mx-auto pt-24 pb-6 px-4 max-w-4xl h-[calc(100vh-2rem)] flex flex-col text-right font-['Outfit'] relative selection:bg-secondary/30"
    >
      {/* هالة توهج محيطية عميقة */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-secondary/[0.02] blur-[120px] pointer-events-none" />

      <div className="bg-[#0D121A] border border-white/[0.05] rounded-2xl shadow-2xl flex flex-col flex-1 overflow-hidden relative z-10">
        {/* Page Header الفخم */}
        <div className="bg-slate-950/40 backdrop-blur-md p-4 md:p-5 border-b border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 border border-secondary/20 text-secondary rounded-xl flex items-center justify-center text-xl shadow-inner">
              <FiCpu className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-white font-extrabold text-sm md:text-base">
                غرفة صياغة المشاريع الذكية
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5 font-light">
                تحدث مع مساعد مسار لتوليد مواصفات مشروعك البرمي وكراسة الشروط
                تلقائياً.
              </p>
            </div>
          </div>
          <span className="bg-green-500/5 text-green-400 border border-green-500/10 px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase animate-pulse">
            Gemini Pipeline Active
          </span>
        </div>

        {/* Chat Stream (فقاعات الشات الزجاجية السلسة) */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-slate-950/10 scrollbar-thin scrollbar-thumb-white/5">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-200`}
            >
              <div
                className={`max-w-[80%] p-3.5 text-xs md:text-sm rounded-2xl leading-relaxed shadow-lg border ${
                  msg.sender === "user"
                    ? "bg-secondary border-secondary/20 text-slate-950 font-bold rounded-bl-none shadow-secondary/5"
                    : "bg-slate-950/60 backdrop-blur-md border-white/[0.04] text-slate-200 rounded-br-none"
                }`}
              >
                {msg.sender === "user" ? (
                  msg.text
                ) : (
                  <div className="prose prose-invert text-xs md:text-sm leading-relaxed max-w-full font-light">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* مؤشر جاري الكتابة الفخم */}
          {isTyping && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-slate-950/40 border border-white/[0.04] text-slate-400 p-3.5 rounded-2xl rounded-br-none flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:0.4s]" />
                <span className="text-secondary font-semibold mr-1">
                  جاري تحليل وهندسة المتطلبات الفنية...
                </span>
              </div>
            </div>
          )}

          {/* إشعار الفشل الفخم المدمج داخل تيار الشات */}
          {lastFailedMessage && !isTyping && (
            <div className="flex justify-center p-2 animate-in fade-in zoom-in-95">
              <div className="bg-red-500/5 border border-red-500/10 text-red-400 px-4 py-3 rounded-xl flex items-center gap-4 text-xs font-semibold">
                <span>⚠️ عطل مؤقت في ربط شبكة الـ Pipeline</span>
                <button
                  onClick={handleRetry}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg transition-colors shadow-md flex items-center gap-1"
                >
                  <FiRefreshCw size={12} /> إعادة المحاولة
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ميجا بانر الـ Call-to-Action الختامي عند اكتمال الـ JSON */}
        {isDataReady && (
          <div className="p-4 bg-secondary/[0.03] border-t border-secondary/20 flex flex-col md:flex-row justify-between items-center gap-4 animate-in slide-in-from-bottom-5 duration-300">
            <div className="text-right">
              <h4 className="text-secondary font-bold text-sm flex items-center gap-1.5">
                <FiCheckCircle /> نموذج المتطلبات الذكي جاهز كلياً!
              </h4>
              <p className="text-slate-400 text-xs mt-0.5 font-light">
                قام السيستم بفرز المهارات، تصنيف القسم، تقدير الميزانية وجدولة
                المواعيد بناءً على حديثك.
              </p>
            </div>
            <Button
              onClick={handleProceedToPost}
              variant="accent"
              className="w-full md:w-auto font-bold text-xs py-3.5 px-6 shadow-xl shadow-secondary/10 text-slate-950 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              الانتقال لصفحة المراجعة والنشر الفوري 🚀
            </Button>
          </div>
        )}

        {/* فورم حقل الإدخال السفلي */}
        {!isDataReady && (
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-slate-950/40 backdrop-blur-md border-t border-white/[0.05] flex gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                lastFailedMessage
                  ? "يرجى الضغط على زر إعادة المحاولة بالأعلى أولاً..."
                  : "اكتب مواصفات مشروعك هنا (مثال: أريد ويب سايت بـ React وميزانيتي 4000$)..."
              }
              disabled={!!lastFailedMessage}
              className="flex-1 bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none transition-colors text-right disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping || !!lastFailedMessage}
              className="bg-secondary text-slate-950 px-5 rounded-xl text-xs md:text-sm font-bold disabled:opacity-30 hover:bg-secondary/90 transition-all flex items-center gap-1.5"
            >
              <FiSend /> إرسال الرد
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
