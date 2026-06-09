import api from "../../../services/api"; // أو مسار الـ axios instance المعتمد عندك

// 1. جلب كل المراحل
export const getProjectMilestones = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/milestones`);
  return response.data;
};

// 2. إنشاء مرحلة جديدة (POST)
export const createMilestone = async ({ projectId, milestoneData }) => {
  const response = await api.post(
    `/projects/${projectId}/milestones`,
    milestoneData,
  );
  return response.data;
};

// 3. تسليم الفريلانسر للشغل (PATCH)
export const submitMilestoneWork = async ({ projectId, milestoneId }) => {
  const response = await api.patch(
    `/projects/${projectId}/milestones/${milestoneId}/submit`,
  );
  return response.data;
};

// 4. موافقة العميل الإدارية (PATCH)
export const approveMilestoneWork = async ({ projectId, milestoneId }) => {
  const response = await api.patch(
    `/projects/${projectId}/milestones/${milestoneId}/approve`,
  );
  return response.data;
};

// =================== 🎯 الدوال المفقودة اللي كانت مسببة الكراش ===================

// 5. شحن ميزانية المرحلة (POST مطابق للـ Postman)
export const fundMilestone = async (milestoneId) => {
  const response = await api.post(`/payments/milestones/${milestoneId}/fund`);
  return response.data;
};

// 6. الإفراج المالي الفعلي وتحويل الأموال للمستقل (POST مطابق للـ Postman)
export const releaseMilestone = async (milestoneId) => {
  const response = await api.post(
    `/payments/milestones/${milestoneId}/release`,
  );
  return response.data;
};

// 7. إنشاء وربط حساب المستقل البنكي (POST مطابق للـ Postman)
export const onboardStripeConnect = async () => {
  const response = await api.post("/stripe-connect/onboard");
  return response.data;
};
