import { useSmartChatPage } from "../features/chatbot/hooks/useSmartChatPage";
import { Button } from "../components";
import ReactMarkdown from "react-markdown";

export default function SmartChatPage() {
  const {
    messages,
    inputText,
    setInputText,
    isTyping,
    isDataReady,
    lastFailedMessage, // 🎯 استدعاء متغير الفشل
    handleRetry, // 🎯 استدعاء دالة إعادة المحاولة
    messagesEndRef,
    handleSendMessage,
    handleProceedToPost,
  } = useSmartChatPage();

  return (
    <div className="container mx-auto pt-24 pb-12 px-4 max-w-4xl h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-primary border border-slate-800 rounded-2xl shadow-2xl flex flex-col flex-1 overflow-hidden">
        {/* Page Header */}
        <div className="bg-slate-900 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-2xl border border-secondary/20">
              🤖
            </div>
            <div>
              <h2 className="text-white font-bold text-base">
                غرفة صياغة المشاريع الذكية
              </h2>
              <p className="text-xs text-slate-400">
                تحدث مع المساعد لتوليد مواصفات مشروعك الفنية تلقائياً
              </p>
            </div>
          </div>
          <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-bold animate-pulse">
            Gemini Active Pipeline
          </span>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-950/30">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] p-4 text-sm rounded-2xl leading-relaxed shadow-md ${
                  msg.sender === "user"
                    ? "bg-secondary text-slate-900 font-semibold rounded-bl-none"
                    : "bg-slate-900 border border-slate-800 text-slate-200 rounded-br-none"
                }`}
              >
                {msg.sender === "user" ? (
                  msg.text
                ) : (
                  <div className="prose prose-invert text-xs md:text-sm leading-relaxed max-w-full">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-slate-800 text-slate-400 p-4 rounded-2xl rounded-br-none flex items-center gap-1 text-xs">
                <span className="text-secondary animate-pulse font-medium">
                  جاري تحليل متطلبات السوق الفنية
                </span>
                <span className="animate-bounce font-extrabold">.</span>
                <span className="animate-bounce [animation-delay:0.2s] font-extrabold">
                  .
                </span>
                <span className="animate-bounce [animation-delay:0.4s] font-extrabold">
                  .
                </span>
              </div>
            </div>
          )}

          {/* 🎯 زر إعادة المحاولة الذكي يظهر هنا كإشعار فخم في تيار الشات لو حصل خطأ */}
          {lastFailedMessage && !isTyping && (
            <div className="flex justify-center p-2 animate-fade-in">
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-4 text-xs">
                <span>⚠️ فشل إرسال الرد الأخير بسبب عطل في الاتصال</span>
                <button
                  onClick={handleRetry}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg transition-colors shadow-md"
                >
                  إعادة المحاولة 🔄
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* الميجا بانر الـ Call-to-Action عند تجهيز الـ JSON */}
        {isDataReady && (
          <div className="p-4 bg-secondary/5 border-t border-secondary/20 flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in-up">
            <div className="text-right">
              <h4 className="text-secondary font-bold text-sm">
                ✨ تم إنشاء نموذج البيانات النظيف للـ Form
              </h4>
              <p className="text-slate-400 text-xs mt-0.5">
                تم فرز المهارات، تصنيف القسم، تقدير Mالميزانية والتعقيد بنجاح.
              </p>
            </div>
            <Button
              onClick={handleProceedToPost}
              variant="accent"
              className="w-full md:w-auto font-bold text-xs py-3 px-6 shadow-xl shadow-secondary/10"
            >
              الانتقال لصفحة المراجعة والنشر الفوري 🚀
            </Button>
          </div>
        )}

        {/* Form Input Container */}
        {!isDataReady && (
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                lastFailedMessage
                  ? "اضغط على زر إعادة المحاولة بالأعلى..."
                  : "اكتب ردك هنا (مثال: نعم الميزانية 5000$ والمهارات المطلوبة Dart و Git)..."
              }
              disabled={!!lastFailedMessage} // قفل التكست بوكس لإجبار العميل يحل المشكلة أولاً بالـ Retry
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-secondary transition-colors text-right disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping || !!lastFailedMessage}
              className="bg-secondary text-slate-900 px-6 rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-secondary/90 transition-opacity"
            >
              إرسال الرد
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
