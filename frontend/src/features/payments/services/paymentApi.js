import api from "../../../services/api";

export const fundMilestone = async (milestoneId) => {
  const response = await api.post(`/payments/milestones/${milestoneId}/fund`);
  return response.data;
};

// 6. الإفراج المالي الفعلي وتحويل المستحقات للفريلانسر (Transform To freelancer)
export const releaseMilestone = async (milestoneId) => {
  const response = await api.post(
    `/payments/milestones/${milestoneId}/release`,
  );
  return response.data;
};

// 7. إنشاء وربط حساب المستقل (createConnectAccount)
export const onboardStripeConnect = async () => {
  const response = await api.post("/stripe-connect/onboard");
  return response.data;
};
