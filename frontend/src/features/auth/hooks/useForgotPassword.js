import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPendingEmail } from "../store/authSlice"; // تأكد من المسار
import api from "../../../services/api"; // التأكد من استخدام axios instance
import toast from "react-hot-toast";

export const useForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (email) => {
      const response = await api.post("/users/forgotPassword", { email });
      return response.data;
    },
    onSuccess: (data, email) => {
      // 1. حفظ الإيميل في الريدكس عشان صفحة الـ OTP تستخدمه
      dispatch(setPendingEmail(email));
      toast.success("تم إرسال كود التحقق إلى بريدك الإلكتروني");
      // 2. التوجه لصفحة الـ OTP اللي إنت برمجتها
      navigate("/verify-otp");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "حدث خطأ ما، حاول مجدداً");
    },
  });
};
