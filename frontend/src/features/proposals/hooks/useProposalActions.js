import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { acceptProposal, rejectProposal } from "../services/porposalsApi";

export const useProposalActions = (projectId) => {
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: acceptProposal,
    onSuccess: () => {
      toast.success(
        "تم قبول العرض! المشروع الآن قيد التنفيذ وبدء بند الدفع الأول 🚀",
      );

      // 🎯 أهم سطرين لربط دورتين البيانات ببعض تلقائياً بدون ريفريش يدوي
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      queryClient.invalidateQueries({ queryKey: ["proposals", projectId] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "حدث خطأ أثناء قبول العرض"),
  });

  const rejectMutation = useMutation({
    mutationFn: rejectProposal,
    onSuccess: () => {
      toast.success("تم رفض العرض.");
      queryClient.invalidateQueries({ queryKey: ["proposals", projectId] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "حدث خطأ"),
  });

  return { acceptMutation, rejectMutation };
};
