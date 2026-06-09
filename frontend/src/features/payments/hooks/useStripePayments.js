import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  fundMilestone,
  releaseMilestone,
  onboardStripeConnect,
} from "../services/paymentApi";

export const useStripePayments = (projectId) => {
  const queryClient = useQueryClient();

  const fundMutation = useMutation({
    mutationFn: fundMilestone,
    onSuccess: (res) => {
      // 1. طباعة الرد في الكونسول عشان لو حبيت تبص عليه
      console.log("الرد الخام من السيرفر:", res);

      // 🎯 2. البحث التلقائي الذكي (Auto-Detect Link)
      // الدالة دي بتلف جوه الأوبجكت وتجيب أول قيمة نصية تبدأ برابط ويب
      const findUrlDynamically = (obj) => {
        if (!obj || typeof obj !== "object") return null;

        // جرب المسارات العادية الأول للسرعة
        const quickUrl =
          obj?.data?.url ||
          obj?.url ||
          obj?.data?.session?.url ||
          obj?.session?.url;
        if (quickUrl) return quickUrl;

        // لو منجحتش، يلف على كل الحقول أوتوماتيك
        for (let key in obj) {
          if (
            typeof obj[key] === "string" &&
            (obj[key].startsWith("http://") || obj[key].startsWith("https://"))
          ) {
            return obj[key];
          }
          if (typeof obj[key] === "object") {
            const nestedUrl = findUrlDynamically(obj[key]);
            if (nestedUrl) return nestedUrl;
          }
        }
        return null;
      };

      const checkoutUrl = findUrlDynamically(res);

      // 3. التوجيه بناءً على الرابط المكتشف تلقائياً
      if (checkoutUrl) {
        toast.success("تم تتبع الرابط بنجاح! جاري التوجيه لـ Stripe... 💳");
        window.location.href = checkoutUrl;
      } else {
        toast.error(
          "لم يتم استلام رابط الدفع من السيرفر، تأكد من الـ Response Structure",
        );
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "فشل الاتصال ببوابة Stripe");
    },
  });

  // 💸 ميوتيشن الإفراج المالي الحقيقي وتحويل الأموال للمستقل (Release)
  const releaseMutation = useMutation({
    mutationFn: releaseMilestone,
    onSuccess: () => {
      toast.success(
        "🎉 ممتاز! تم تحويل الأموال بنجاح من حساب المنصة لمحفظة المستقل.",
      );
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "فشل الإفراج عن الأموال");
    },
  });

  return {
    fundMilestoneMutate: fundMutation.mutate,
    isFunding: fundMutation.isPending,
    releaseMilestoneMutate: releaseMutation.mutate,
    isReleasing: releaseMutation.isPending,
  };
};
