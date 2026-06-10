import { useNotifications } from "../hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale"; // لضمان ظهور التوقيت بالعربي (منذ دقيقتين، منذ ساعة...)

// 🎯 دالة مساعدة لترجمة الـ enum الراجع من الباك إند لأيقونة ونص عربي فخم
const getNotificationDetails = (type) => {
  switch (type) {
    case "proposal_received":
      return {
        icon: "📩",
        title: "عرض جديد",
        bg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      };
    case "proposal_accepted":
      return {
        icon: "🤝",
        title: "تم قبول العرض",
        bg: "bg-green-500/10 border-green-500/20 text-green-400",
      };
    case "proposal_rejected":
      return {
        icon: "❌",
        title: "تم رفض العرض",
        bg: "bg-red-500/10 border-red-500/20 text-red-400",
      };
    case "milestone_created":
      return {
        icon: "📌",
        title: "مرحلة جديدة",
        bg: "bg-purple-500/10 border-purple-500/20 text-purple-400",
      };
    case "milestone_funded":
      return {
        icon: "💳",
        title: "تم تمويل المرحلة",
        bg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      };
    case "milestone_submitted":
      return {
        icon: "📤",
        title: "تسليم عمل",
        bg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
      };
    case "milestone_approved":
      return {
        icon: "✅",
        title: "تمت الموافقة",
        bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      };
    case "payment_released":
      return {
        icon: "💰",
        title: "تحرير دفعة مالية",
        bg: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
      };
    case "project_completed":
      return {
        icon: "👑",
        title: "اكتمل المشروع",
        bg: "bg-teal-500/10 border-teal-500/20 text-teal-400",
      };
    case "message_received":
      return {
        icon: "💬",
        title: "رسالة جديدة",
        bg: "bg-sky-500/10 border-sky-500/20 text-sky-400",
      };
    case "system":
      return {
        icon: "⚙️",
        title: "تحديث نظام",
        bg: "bg-slate-500/10 border-slate-500/20 text-slate-400",
      };
    default:
      return {
        icon: "🔔",
        title: "إشعار جديد",
        bg: "bg-secondary/10 border-secondary/20 text-secondary",
      };
  }
};

export default function NotificationsDropdown({ isOpen, onClose }) {
  const {
    notifications,
    unreadCount,
    isLoadingNotifications,
    markAsRead,
    markAllAsRead,
    isMarkingAll,
    removeNotification,
  } = useNotifications();

  if (!isOpen) return null;

  return (
    <div className="absolute left-0 mt-3 w-96 bg-primary/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in-down">
      {/* القائمة العلوية الـ Header */}
      <div className="p-4 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-sm">الإشعارات</span>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
              {unreadCount} جديدة
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            disabled={isMarkingAll}
            className="text-secondary hover:text-secondary/80 text-xs font-semibold transition-colors disabled:opacity-40"
          >
            {isMarkingAll ? "جاري التحديث..." : "قراءة الكل ✓"}
          </button>
        )}
      </div>

      {/* تيار وجسم الإشعارات الـ Stream */}
      <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-900">
        {isLoadingNotifications ? (
          <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
            <span>جاري جلب آخر التنبيهات...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
            <span className="text-3xl">📭</span>
            <span>صندوق الإشعارات فارغ حالياً</span>
          </div>
        ) : (
          notifications.map((notif) => {
            const details = getNotificationDetails(notif.type);
            return (
              <div
                key={notif._id}
                onClick={() => !notif.isRead && markAsRead(notif._id)}
                className={`p-4 flex gap-3 hover:bg-slate-900/40 transition-colors cursor-pointer relative group ${
                  !notif.isRead ? "bg-secondary/[0.02]" : ""
                }`}
              >
                {/* الشارة الزرقاء للإشعار غير المقروء */}
                {!notif.isRead && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-secondary rounded-full" />
                )}

                {/* الأيقونة الـ Styled بناءً على نوع الإشعار */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border shrink-0 ${details.bg}`}
                >
                  {details.icon}
                </div>

                {/* محتوى ونص الإشعار */}
                <div className="flex-1 min-w-0 text-right pr-2">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-white font-bold text-xs truncate">
                      {notif.title || details.title}
                    </span>
                    <span className="text-slate-500 text-[10px] shrink-0">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                        locale: ar,
                      })}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>
                </div>

                {/* زر حذف الإشعار الذي يظهر عند الـ Hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // منع إثارة حدث القراءة عند مسح الإشعار
                    removeNotification(notif._id);
                  }}
                  className="absolute left-3 top-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  title="حذف الإشعار"
                >
                  🗑️
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
