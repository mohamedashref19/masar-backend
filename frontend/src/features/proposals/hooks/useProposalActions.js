import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { acceptProposal, rejectProposal } from "../services/porposalsApi";

export const useProposalActions = (projectId) => {
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: acceptProposal,
    onSuccess: () => {
      toast.success("تم قبول العرض! المشروع الآن قيد التنفيذ 🚀");
      // بنعمل ريفريش للعروض وللمشروع نفسه عشان حالته تتغير لـ in-progress
      queryClient.invalidateQueries({ queryKey: ["proposals", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "حدث خطأ"),
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
