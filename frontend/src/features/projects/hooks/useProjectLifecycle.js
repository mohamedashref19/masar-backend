import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeProject, cancelProject } from "../services/projectsApi";
import { addReview } from "../../reviews/services/reviewsApi";

export const useProjectLifecycle = () => {
  const queryClient = useQueryClient();

  // 1. إنهاء المشروع
  const completeMutation = useMutation({
    mutationFn: completeProject,
    onSuccess: () => {
      toast.success("تم إنهاء المشروع بنجاح! 🎉");
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });

  // 2. إلغاء المشروع
  const cancelMutation = useMutation({
    mutationFn: cancelProject,
    onSuccess: () => {
      toast.success("تم إلغاء المشروع.");
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });

  // 3. إضافة التقييم
  const reviewMutation = useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      toast.success("تم إضافة تقييمك للمستقل بنجاح! 🌟");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء إضافة التقييم",
      );
    },
  });

  return { completeMutation, cancelMutation, reviewMutation };
};
