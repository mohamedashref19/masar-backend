import api from "../../../services/api"; // كائن الـ axios المعتمد عندك

// 1. جلب كل الإشعارات الخاصة باليوزر (تم حذف /my-notifications لتطابق '/')
export const getMyNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

// 2. جلب عدد الإشعارات غير المقروءة (كما هي متطابقة)
export const getUnreadCount = async () => {
  const response = await api.get("/notifications/unread-count");
  return response.data;
};

// 3. تحديد إشعار معين كـ مقروء
export const markNotificationAsRead = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

// 4. تحديد كل الإشعارات كـ مقروءة دفعة واحدة
export const markAllNotificationsAsRead = async () => {
  const response = await api.patch("/notifications/mark-all-read");
  return response.data;
};

// 5. حذف إشعار
export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};
