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

    onSuccess: (data) => {
      // 1. إظهار رسالة النجاح
      toast.success("تم تفعيل حسابك بنجاح!");

      // 2. حفظ الـ Token وبيانات المستخدم في Redux
      // الباك إند بيبعت الرد في شكل { status: 'success', token, user }
      dispatch(setCredentials({ user: data.user, token: data.token }));

      // 3. التوجيه للصفحة الرئيسية أو الداشبورد
      navigate("/");
    },

    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "رمز التحقق غير صحيح أو منتهي الصلاحية";
      toast.error(errorMessage);
    },
  });
};
