import api from "../../../services/api";

// 1. جلب قائمة كل المحادثات لليوزر الحالي (الـ Inbox)
export const getInbox = async () => {
  const response = await api.get("/chat/conversations");
  return response.data;
};

// 2. جلب رسائل محادثة معينة عن طريق الـ ID
export const getMessages = async (conversationId) => {
  const response = await api.get(
    `/chat/conversations/${conversationId}/messages`,
  );
  return response.data;
};

// 3. إرسال رسالة جديدة داخل المحادثة
export const sendMessage = async ({ conversationId, content }) => {
  const response = await api.post(
    `/chat/conversations/${conversationId}/messages`,
    { content },
  );
  return response.data;
};

// 4. إنشاء أو جلب غرفة محادثة مبنية على مشروع وفريلانسر معين
export const createConversation = async ({ projectId, freelancerId }) => {
  const response = await api.post("/chat/conversations", {
    projectId,
    freelancerId,
  });
  return response.data;
};
