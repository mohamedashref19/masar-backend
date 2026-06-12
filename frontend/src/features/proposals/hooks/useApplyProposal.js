import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createProposal } from "../services/porposalsApi";

// 🎯 استبدلنا الـ callback الواحد بكائن options كامل ومأمن
export const useApplyProposal = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProposal,

    onSuccess: (data) => {
      toast.success("تم إرسال عرضك بنجاح! 🚀");
      queryClient.invalidateQueries({ queryKey: ["project"] });

      // تنفيذ الـ onSuccess الممررة من المودال
      if (typeof options === "function") {
        options(); // للتوافق لو كنت بتباصي دالة مباشرة
      } else if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },

    onError: (error) => {
      // 🚀 لقط الـ Status Code الحقيقي من الـ Response اللي شفناه في الـ Network
      const statusCode =
        error.response?.data?.error?.statusCode || error.response?.status;

      let message =
        error.response?.data?.message || "حدث خطأ أثناء إرسال العرض";
      if (message.includes("duplicate key error")) {
        message = "لقد قدمت عرضاً على هذا المشروع من قبل!";
      }

      // 🎯 التريكة السحرية: لو الخطأ 403 (حظر الـ AI) اسكت خالص ومتظهرش الـ Toast الإنجليزي
      // وسيب الـ Swal الفخم اللي برمجناه جوه المودال هو اللي ينفجر في الشاشة!
      if (statusCode !== 403) {
        toast.error(message);
      }

      // تمرير الـ error للمودال عشان الـ Swal يلقطه ويقرأ الـ 403
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};
