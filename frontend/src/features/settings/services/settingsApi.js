import api from "../../../services/api";

// تأكد أن الدالة بداخل settingsApi.js بسيطة كذا وبدون Headers معقدة:
export const updateMe = async (payload) => {
  const response = await api.patch("/users/updateMe", payload);
  return response.data;
};

export const updateMyPassword = async (passwordData) => {
  const response = await api.patch("/users/updateMyPassword", passwordData);
  return response.data;
};
