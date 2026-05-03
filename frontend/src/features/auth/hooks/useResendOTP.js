import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { resendOTP } from "../services/authApi";

export const useResendOTP = () => {
  return useMutation({
    mutationFn: resendOTP,

    onSuccess: (data) => {
      toast.success(data.message || "تم إرسال كود جديد إلى بريدك الإلكتروني!");
    },

    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "حدث خطأ أثناء إرسال الكود";
      toast.error(errorMessage);
    },
  });
};
