import { useNotifications } from "../hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { FiTrash2, FiBellOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const getNotificationDetails = (type) => {
  switch (type) {
    case "proposal_received":
      return {
        icon: "📩",
        title: "عرض جديد",
        bg: "bg-blue-500/5 border-blue-500/10 text-blue-400",
      };
    case "proposal_accepted":
      return {
        icon: "🤝",
        title: "تم قبول العرض",
        bg: "bg-green-500/5 border-green-500/10 text-green-400",
      };
    case "proposal_rejected":
      return {
        icon: "❌",
        title: "تم رفض العرض",
        bg: "bg-red-500/5 border-red-500/10 text-red-400",
      };
    case "milestone_created":
      return {
        icon: "📌",
        title: "مرحلة جديدة",
        bg: "bg-purple-500/5 border-purple-500/10 text-purple-400",
      };
    case "milestone_funded":
      return {
        icon: "💳",
        title: "تم تمويل المرحلة",
        bg: "bg-amber-500/5 border-amber-500/10 text-amber-400",
      };
    case "milestone_submitted":
      return {
        icon: "📤",
        title: "تسليم عمل",
        bg: "bg-indigo-500/5 border-indigo-500/10 text-indigo-400",
      };
    case "milestone_approved":
      return {
        icon: "✅",
        title: "تمت الموافقة",
        bg: "bg-emerald-500/5 border-emerald-500/10 text-emerald-400",
      };
    case "payment_released":
      return {
        icon: "💰",
        title: "تحرير دفعة مالية",
        bg: "bg-yellow-500/5 border-yellow-500/10 text-yellow-400",
      };
    case "project_completed":
      return {
        icon: "👑",
        title: "اكتمل المشروع",
        bg: "bg-teal-500/5 border-teal-500/10 text-teal-400",
      };
    case "message_received":
      return {
        icon: "💬",
        title: "رسالة جديدة",
        bg: "bg-sky-500/5 border-sky-500/10 text-sky-400",
      };
    case "system":
      return {
        icon: "⚙️",
        title: "تحديث نظام",
        bg: "bg-slate-500/5 border-slate-500/10 text-slate-400",
      };
    default:
      return {
        icon: "🔔",
        title: "إشعار جديد",
        bg: "bg-secondary/5 border-secondary/10 text-secondary",
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
  const navigate = useNavigate();

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      markAsRead(notif._id);
    }
    if (notif.relatedProject) {
      navigate(`/projects/${notif.relatedProject}`);
    }
  };

  if (!isOpen) return null;

  return (
    // 🎯 تم تعديل التموضع لـ left-0 أو right-[-160px] ليرسو بدقة بالملي تحت كبسولة جرس النيفبار المعلق بدون الخروج عن أبعاد الـ Layout
    <div
      dir="rtl"
      className="absolute left-0 md:left-auto md:right-[-160px] mt-3 w-[360px] sm:w-96 bg-[#0B0F17]/95 backdrop-blur-2xl border border-white/[0.06] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-right"
    >
      {/* القائمة العلوية الـ Header */}
      <div className="p-4 bg-slate-950/40 border-b border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white font-extrabold text-xs md:text-sm">
            مركز التنبيهات الحية
          </span>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse">
              {unreadCount} جديدة
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            disabled={isMarkingAll}
            className="text-secondary hover:text-white text-xs font-bold transition-colors disabled:opacity-40"
          >
            {isMarkingAll ? "جاري التحديث..." : "قراءة الكل ✓"}
          </button>
        )}
      </div>

      {/* تيار وجسم الإشعارات الـ Stream */}
      <div className="max-h-[360px] overflow-y-auto divide-y divide-white/[0.02] scrollbar-thin scrollbar-thumb-white/5">
        {isLoadingNotifications ? (
          <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center gap-2.5">
            <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium">
              جاري مزامنة خط الإشعارات الفوري...
            </span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-xs flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/[0.01] border border-white/[0.04] flex items-center justify-center text-slate-600 text-lg">
              <FiBellOff />
            </div>
            <span className="font-light">
              صندوق الإشعارات فارغ ومستقر حالياً
            </span>
          </div>
        ) : (
          notifications.map((notif) => {
            const details = getNotificationDetails(notif.type);
            return (
              <div
                key={notif._id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 flex gap-3 hover:bg-white/[0.01] transition-all cursor-pointer relative group ${
                  !notif.isRead ? "bg-secondary/[0.01]" : ""
                }`}
              >
                {/* الشارة المضيئة للإشعار غير المقروء - تم ضبطها يساراً لعدم حجب الأيقونة */}
                {!notif.isRead && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-secondary rounded-full shadow-[0_0_10px_#E4FF00]" />
                )}

                {/* الأيقونة الـ Styled بناءً على نوع الإشعار */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base border shrink-0 shadow-inner ${details.bg}`}
                >
                  {details.icon}
                </div>

                {/* محتوى ونص الإشعار */}
                <div className="flex-1 min-w-0 text-right pr-1 pl-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-slate-200 font-bold text-xs truncate group-hover:text-secondary transition-colors">
                      {notif.title || details.title}
                    </span>
                    <span
                      className="text-slate-500 text-[9px] font-medium shrink-0 font-mono"
                      dir="ltr"
                    >
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                        locale: ar,
                      })}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed line-clamp-2 font-light">
                    {notif.message}
                  </p>
                </div>

                {/* زر حذف الإشعار الحركي الناعم عند الـ Hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notif._id);
                  }}
                  className="absolute left-3 top-4 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-red-500/5 rounded-md border border-transparent hover:border-red-500/10"
                  title="حذف الإشعار"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
