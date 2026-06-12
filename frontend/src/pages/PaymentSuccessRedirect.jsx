import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion"; // 🎯 حقن الحركة الموحدة للمنصة
import toast from "react-hot-toast";
import { FiCheckCircle, FiShield } from "react-icons/fi";

export default function PaymentSuccessRedirect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // لقط الـ IDs اللي Stripe والباك إند بيرجعوهم في الرابط
  const projectId = searchParams.get("projectId");

  useEffect(() => {
    // 1. تنظيف كاش الـ React Query تماماً لإجبار السيستم على سحب الحالة الجديدة
    queryClient.clear();
    queryClient.invalidateQueries();

    toast.success("تمت المعاملة وتأمين المستحقات بنجاح! 💳🎉");

    // 2. التوجيه الفوري لصفحة المشروع المحدثة
    if (projectId) {
      const timer = setTimeout(() => {
        navigate(`/projects/${projectId}`);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        navigate("/client-dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [navigate, queryClient, projectId]);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#080B10] text-slate-100 flex flex-col items-center justify-center px-4 relative overflow-hidden font-['Outfit']"
    >
      {/* 🌌 تأثيرات الإضاءة المحيطية العميقة المتناسقة مع بوابة مسار المالية */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-green-500/[0.03] blur-[100px]" />
      </div>

      {/* الحاوية الحركية لصندوق تأكيد الدفع */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm z-10 text-center space-y-6"
      >
        {/* شارة النجاح والتأمين المتوهجة (Premium Cyber Badge) */}
        <div className="relative inline-flex items-center justify-center">
          {/* تأثير نبض الخلفية المأمنة */}
          <div className="absolute inset-0 rounded-2xl bg-green-500/10 border border-green-500/20 blur-xl animate-pulse" />

          <div className="relative w-20 h-20 bg-gradient-to-tr from-green-500/10 to-[#10B981]/5 border border-green-500/20 rounded-2xl flex items-center justify-center text-green-400 text-4xl shadow-[0_15px_40px_rgba(16,185,129,0.1)]">
            <FiCheckCircle className="animate-in zoom-in-50 duration-300" />
          </div>
        </div>

        {/* نصوص الحالة والـ Ledger */}
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white tracking-tight">
            تم تأمين الدفعة بنجاح
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            لقد تم حجز وتأمين الأموال عبر نظام الـ Escrow المشروط. جاري تحديث
            الـ Ledger المالي وحالة التعاقد اللحظية...
          </p>
        </div>

        {/* لودر التوجيه الانسيابي النظيف بدلاً من الدائرة التقليدية */}
        <div className="w-48 h-1 bg-slate-900 rounded-full mx-auto overflow-hidden relative border border-white/[0.03]">
          <div className="absolute top-0 bottom-0 right-0 bg-gradient-to-l from-green-400 to-[#10B981] w-1/2 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>

        {/* شارة الحماية القانونية السفلية */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.01] border border-white/[0.04] rounded-xl text-[10px] text-slate-500 font-semibold uppercase tracking-wider mx-auto">
          <FiShield className="text-green-500/70" /> مسار Escrow Secured
        </div>
      </motion.div>

      {/* حقن إنميشن اللودر الأفقي الصغير في الـ CSS الخاص بالصفحة */}
      <style>{`
        @keyframes loading {
          0% { right: -50%; width: 30%; }
          50% { width: 40%; }
          100% { right: 110%; width: 30%; }
        }
      `}</style>
    </div>
  );
}
