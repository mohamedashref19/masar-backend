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
