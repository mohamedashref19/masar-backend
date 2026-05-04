import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createProposal } from "../services/porposalsApi";

export const useApplyProposal = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProposal,
    onSuccess: () => {
      toast.success("تم إرسال عرضك بنجاح! 🚀");
      // بنحدث بيانات المشروع عشان لو عايزين نغير حالة الزرار لـ "تم التقديم"
      queryClient.invalidateQueries({ queryKey: ["project"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      // لو الباك إند ضرب إيرور (مثلاً قدم قبل كدة بسبب الـ unique index)
      let message =
        error.response?.data?.message || "حدث خطأ أثناء إرسال العرض";
      if (message.includes("duplicate key error")) {
        message = "لقد قدمت عرضاً على هذا المشروع من قبل!";
      }
      toast.error(message);
    },
  });
};
