import { useMutation } from "@tanstack/react-query";
import api from "../../../services/api";
import toast from "react-hot-toast";

// 🎯 1. خففنا الـ Imports وشيلنا الـ useNavigate والـ useDispatch خالص
// 🎯 2. مررنا كائن الـ options الافتراضي في استقبال الـ Hook
export const useForgotPassword = (options = {}) => {
  return useMutation({
    mutationFn: async (email) => {
      const response = await api.post("/users/forgotPassword", { email });
      return response.data;
    },
    onSuccess: (data, email) => {
      // ❌ تم حذف الـ dispatch والـ navigate القديمة نهائياً لمنع الانتقال لصفحة الـ OTP!

      // 🎯 3. تشغيل الـ Callback اللي جاي من صفحة الـ UI (اللي جواه الـ Swal النيوني الفخم)
      if (options?.onSuccess) {
        options.onSuccess(data);
      } else {
        // حماية افتراضية لو مستخدمتش الـ Swal في مكان تاني
        toast.success("تم إرسال رابط استعادة المرور لبريدك الإلكتروني");
      }
    },
    onError: (error) => {
      // 🎯 4. تمرير الخطأ للـ Swal الأحمر في صفحة الـ UI
      if (options?.onError) {
        options.onError(error);
      } else {
        toast.error(error.response?.data?.message || "حدث خطأ ما، حاول مجدداً");
      }
    },
  });
};
