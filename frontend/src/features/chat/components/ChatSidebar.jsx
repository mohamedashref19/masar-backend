export default function ChatSidebar({ conversations, activeId, onSelect }) {
  return (
    <div
      dir="rtl"
      className="w-full h-full bg-[#0D121A]/40 backdrop-blur-md flex flex-col text-right"
    >
      {/* هيدر القائمة */}
      <div className="p-4 border-b border-white/[0.05] bg-slate-950/20">
        <h2 className="text-base font-black text-white tracking-tight">
          غرف النقاش الفني
        </h2>
      </div>

      {/* لستة المحادثات */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/[0.02] scrollbar-thin scrollbar-thumb-white/5">
        {conversations.length === 0 ? (
          <p className="p-8 text-xs text-slate-500 text-center font-light">
            لا توجد غرف محادثات مفتوحة حالياً.
          </p>
        ) : (
          conversations.map((chat) => {
            const isActive = chat._id === activeId;
            return (
              <div
                key={chat._id}
                onClick={() => onSelect(chat._id)}
                className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-l-4 ${
                  isActive
                    ? "bg-white/[0.03] border-secondary shadow-inner"
                    : "border-transparent hover:bg-white/[0.01]"
                }`}
              >
                {/* الأفاتار الحاضن لأول حرفين من عنوان المشروع */}
                <div className="w-9 h-9 rounded-xl bg-slate-950 border border-white/[0.08] flex items-center justify-center font-bold text-slate-300 text-xs shrink-0 group-hover:border-secondary/30 transition-colors">
                  {chat.project?.title?.substring(0, 2) || "💬"}
                </div>

                {/* تفاصيل المحادثة */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-200 truncate">
                    {chat.project?.title || "مشروع غير معروف"}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate mt-1 font-light">
                    {chat.lastMessage?.content ||
                      "اضغط لمزامنة وبدء الشات الحركي..."}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
