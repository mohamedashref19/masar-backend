export default function ChatSidebar({ conversations, activeId, onSelect }) {
  return (
    <div className="w-full md:w-80 bg-slate-900/50 backdrop-blur-md border-l border-slate-800 h-[calc(100vh-5rem)] overflow-y-auto">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-heading">المحادثات</h2>
      </div>
      <div className="divide-y divide-slate-800/60">
        {conversations.length === 0 ? (
          <p className="p-4 text-sm text-slate-500 text-center">
            لا توجد محادثات حالياً
          </p>
        ) : (
          conversations.map((chat) => {
            const isActive = chat._id === activeId;
            return (
              <div
                key={chat._id}
                onClick={() => onSelect(chat._id)}
                className={`p-4 flex items-center gap-3 cursor-pointer transition-all ${
                  isActive
                    ? "bg-slate-800/80 border-r-4 border-secondary"
                    : "hover:bg-slate-800/30"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-200">
                  {chat.project?.title?.substring(0, 2) || "💬"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-200 truncate">
                    {chat.project?.title || "مشروع غير معروف"}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-1">
                    {chat.lastMessage?.content || "اضغط لبدء المحادثة..."}
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
