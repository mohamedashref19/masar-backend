import api from "../../../services/api";

export const getFreelancers = async (queryString = "") => {
  // الـ queryString هيشيل الفلاتر زي ?skills=React&freelancerProfile.hourlyRate[lte]=20
  const response = await api.get(`/users/freelancers?${queryString}`);
  return response.data;
};

// ضيف الدالة دي تحت دالة getFreelancers
export const getFreelancerById = async (id) => {
  const response = await api.get(`/users/freelancers/${id}`);
  return response.data;
};
