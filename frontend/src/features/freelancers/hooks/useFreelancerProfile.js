import { useQuery } from "@tanstack/react-query";
import { getFreelancerById } from "../services/freelancersApi";
import { getFreelancerReviews } from "../../reviews/services/reviewsApi";

export const useFreelancerProfile = (id) => {
  const profileQuery = useQuery({
    queryKey: ["freelancer", id],
    queryFn: () => getFreelancerById(id),
    enabled: !!id,
  });

  const reviewsQuery = useQuery({
    queryKey: ["freelancer-reviews", id],
    queryFn: () => getFreelancerReviews(id),
    enabled: !!id,
    retry: 1, // عشان لو ضرب 500 ميحاولش 3 مرات ويعطلنا
  });

  // 👇 هنا التعديل المهم: بنستخرج freelancer زي ما ظهر في الكونسول
  const profileData =
    profileQuery.data?.data?.freelancer || profileQuery.data?.data;

  return {
    profile: profileData,
    reviews:
      reviewsQuery.data?.reviews || reviewsQuery.data?.data?.reviews || [],

    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
  };
};
