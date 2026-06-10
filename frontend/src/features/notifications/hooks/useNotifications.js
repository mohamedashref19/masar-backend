import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/notificationApi";
import toast from "react-hot-toast";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // 🎯 1. هوك جلب الإشعارات
  const { data: notificationsData, isLoading: isLoadingNotifications } =
    useQuery({
      queryKey: ["notifications"],
      queryFn: getMyNotifications,
      select: (res) => res?.data?.notifications || [],
    });

  // 🎯 2. هوك جلب عدد الإشعارات غير المقروءة (مثالي لعرض شارة حمراء فوق الأيقونة)
  const { data: unreadCount, isLoading: isLoadingCount } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    select: (res) => res?.data?.unreadCount || 0,
    refetchInterval: 30000, // بونص بكرة للجنة: التشييك تلقائياً كل 30 ثانية خلفية (Polling)
  });

  // 🎯 3. ميوتيشن قراءة إشعار معين
  const { mutate: markAsRead } = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // تحديث الكاش لتسمع الداتا فوراً في الـ UI
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });

  // 🎯 4. ميوتيشن قراءة كل الإشعارات
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
      toast.success("تم تحديد جميع الإشعارات كـ مقروءة");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث الإشعارات");
    },
  });

  // 🎯 5. ميوتيشن حذف إشعار
  const { mutate: removeNotification } = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
      toast.success("تم حذف الإشعار بنجاح");
    },
  });

  return {
    notifications: notificationsData,
    unreadCount,
    isLoadingNotifications,
    isLoadingCount,
    markAsRead,
    markAllAsRead,
    isMarkingAll,
    removeNotification,
  };
};
