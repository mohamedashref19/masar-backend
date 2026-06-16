import api from "../../../services/api";

// services/settingsApi.js
export const updateMe = async (formData) => {
  const response = await api.patch("/users/updateMe", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateMyPassword = async (passwordData) => {
  const response = await api.patch("/users/updateMyPassword", passwordData);
  return response.data;
};
