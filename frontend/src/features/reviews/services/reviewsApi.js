import api from "../../../services/api";

export const addReview = async (reviewData) => {
  // reviewData هتحتوي على: project, freelancer, rating, review
  const response = await api.post("/reviews", reviewData);
  return response.data;
};
export const getFreelancerReviews = async (freelancerId) => {
  const response = await api.get(`/reviews/freelancer/${freelancerId}`);
  return response.data;
};

// حذف تقييم معين
export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

// تعديل تقييم
export const updateReview = async ({ reviewId, reviewData }) => {
  const response = await api.patch(`/reviews/${reviewId}`, reviewData);
  return response.data;
};
