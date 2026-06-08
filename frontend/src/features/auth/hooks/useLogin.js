import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../services/authApi";
// استوردنا setPendingEmail عشان نحفظ الإيميل لو احتاج تفعيل
import { setCredentials, setPendingEmail } from "../store/authSlice";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      console.log("البيانات اللي راجعة من السيرفر:", data);

      // 🎯 استخراج ذكي لليوزر والتوكن
      const user = data?.data?.user || data?.user;
      const token = data?.data?.token || data?.token; // 👈 التعديل هنا

      if (user && token) {
        toast.success("تم تسجيل الدخول بنجاح! أهلاً بك في مسار 🚀");
        dispatch(setCredentials({ user, token }));

        const destination = location.state?.from?.pathname || "/";
        navigate(destination, { replace: true });
      } else {
        throw new Error("بيانات المستخدم غير مكتملة من السيرفر");
      }
    },

    // ضفنا variables هنا عشان نقدر نوصل للبيانات اللي اليوزر بعتها (الإيميل والباسورد)
    onError: (error, variables) => {
      // 1. استخراج الداتا اللي راجعة من الباك إند
      const errorData = error.response?.data;
      const errorMessage =
        errorData?.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة";

      // 2. التحقق بناءً على الـ Flag اللي الباك إند بعته (أدق وأضمن)
      if (errorData?.actionRequired === "VERIFY_OTP") {
        toast.error("يرجى تفعيل حسابك أولاً لإتمام الدخول.");

        // 3. نحفظ الإيميل (سواء اللي راجع من السيرفر أو اللي اليوزر كتبه)
        const emailToVerify = errorData?.email || variables.email;
        dispatch(setPendingEmail(emailToVerify));

        // 4. توجيه فوري لصفحة التفعيل
        navigate("/verify-otp");
      } else {
        // لو مشكلة تانية (زي الباسورد غلط)
        toast.error(errorMessage);
      }
    },
  });
};
