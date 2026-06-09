import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function PaymentSuccessRedirect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // لقط الـ IDs اللي Stripe والباك إند بيرجعوهم في الرابط
  const projectId = searchParams.get("projectId");

  useEffect(() => {
    // 1. تنظيف كاش الـ React Query تماماً عشان نجبر السيستم ينسى الحالة القديمة
    queryClient.clear();
    queryClient.invalidateQueries();

    toast.success("تمت المعاملة وتأمين المستحقات بنجاح! 💳🎉");

    // 2. التوجيه الفوري لصفحة المشروع المحدثة
    if (projectId) {
      setTimeout(() => {
        navigate(`/projects/${projectId}`);
      }, 1500);
    } else {
      setTimeout(() => {
        navigate("/client-dashboard");
      }, 1500);
    }
  }, [navigate, queryClient, projectId]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-950 text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary mb-4"></div>
      <p className="text-lg text-slate-300 animate-pulse">
        جاري تحديث الـ Ledger المالي وحالة المشروع اللحظية...
      </p>
    </div>
  );
}
