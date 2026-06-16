import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { verifyOTP } from "../services/authApi";
import { setCredentials } from "../store/authSlice";

export const useVerifyOTP = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: verifyOTP,

    onSuccess: (responseData) => {
      // 1. إظهار رسالة النجاح
      toast.success("تم تفعيل حسابك بنجاح! 🎉");

      // 2. استخراج ذكي ومرن يغطي كافة احتمالات هيكلة الـ JSON من الباك إند
      const token = responseData?.token || responseData?.data?.token;
      const user =
        responseData?.user || responseData?.data?.user || responseData?.data;

      // 3. حفظ الـ Token وبيانات المستخدم في Redux
      dispatch(setCredentials({ user, token }));

      // 4. التوجيه للصفحة الرئيسية بعد اكتمال جلسة التحقق
      navigate("/");
    },

    onError: (error) => {
      console.error("💥 خطأ أثناء تفعيل الـ OTP:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "رمز التحقق غير صحيح أو منتهي الصلاحية";
      toast.error(errorMessage);
    },
  });
};
