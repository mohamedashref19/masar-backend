import api from "../../../services/api";

// 1. شحن ميزانية المرحلة (POST)
export const fundMilestone = async (milestoneId) => {
  const response = await api.post(`/payments/milestones/${milestoneId}/fund`);
  return response.data;
};

// 2. تحرير الأموال للمستقل (POST)
export const releaseMilestone = async (milestoneId) => {
  const response = await api.post(
    `/payments/milestones/${milestoneId}/release`,
  );
  return response.data;
};

// 3. 🚨 تعديل المسار الحرج لربط حساب Stripe Connect للفريلانسر
export const onboardStripeConnect = async () => {
  const response = await api.post("/stripe-connect/onboard");
  return response.data;
};
