import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFreelancerById } from "../services/freelancersApi";
import {
  getFreelancerReviews,
  deleteReview,
  updateReview,
} from "../../reviews/services/reviewsApi";
import toast from "react-hot-toast";

export const useFreelancerProfile = (id) => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["freelancer", id],
    queryFn: () => getFreelancerById(id),
    enabled: !!id,
  });

  const reviewsQuery = useQuery({
    queryKey: ["freelancer-reviews", id],
    queryFn: () => getFreelancerReviews(id),
    enabled: !!id,
    retry: 1,
  });

  // 🎯 ميوتيشن حذف التقييم
  const deleteReviewMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(["freelancer-reviews", id]);
      toast.success("تم حذف التقييم بنجاح");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء الحذف");
    },
  });

  // 🎯 ميوتيشن تعديل التقييم
  const updateReviewMutation = useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      queryClient.invalidateQueries(["freelancer-reviews", id]);
      toast.success("تم تحديث التقييم بنجاح 🎉");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء التحديث");
    },
  });

  const profileData =
    profileQuery.data?.data?.freelancer || profileQuery.data?.data;

  return {
    profile: profileData,
    reviews:
      reviewsQuery.data?.reviews || reviewsQuery.data?.data?.reviews || [],
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    // تصدير الأكشنز للـ UI
    onDeleteReview: deleteReviewMutation.mutate,
    onUpdateReview: updateReviewMutation.mutate,
    isDeletingReview: deleteReviewMutation.isPending,
    isUpdatingReview: updateReviewMutation.isPending,
  };
};
