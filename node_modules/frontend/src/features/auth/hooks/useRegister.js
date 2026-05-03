import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { signupUser } from "../services/authApi";
import { setPendingEmail } from "../store/authSlice";

export const useRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signupUser,

    onSuccess: (data, variables) => {
      // 1. إظهار رسالة النجاح
      toast.success(data.message || "تم إرسال رمز التحقق بنجاح!");

      // 2. حفظ الإيميل في Redux
      dispatch(setPendingEmail(variables.email));

      // 3. التوجيه لشاشة الـ OTP
      navigate("/verify-otp");
    },

    onError: (error) => {
      console.error("Registration error:", error);
      let errorMessage =
        error.response?.data?.message || "حدث خطأ أثناء التسجيل";

      if (errorMessage.includes("E11000")) {
        errorMessage = "هذا البريد الإلكتروني مسجل بالفعل";
      }

      toast.error(errorMessage);
    },
  });
};
