import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import VerifyOTPForm from "../features/auth/components/VerifyOTPForm";
import { useVerifyOTP } from "../features/auth/hooks/useVerifyOTP";
import { motion } from "framer-motion"; // 🎯 حقن الحركة الموحدة مع بقية النظام
import { FiShield } from "react-icons/fi";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const emailForOTP = useSelector((state) => state.auth.emailForOTP);

  const { mutate: verify, isPending } = useVerifyOTP();

  useEffect(() => {
    if (!emailForOTP) {
      navigate("/register");
    }
  }, [emailForOTP, navigate]);

  const handleVerify = (otpCode) => {
    // تجميع مستندات التحقق وإرسالها للهوك الفعلي
    verify({ email: emailForOTP, otp: otpCode });
  };

  if (!emailForOTP) return null;

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-[#080B10] px-4 py-12 relative overflow-hidden text-right selection:bg-secondary/30 font-['Outfit']"
    >
      {/* 🌌 تأثيرات الإضاءة المحيطية العميقة الـ Cyber-Punk Glow الموحدة للبراند بالكامل */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 h-[450px] w-[450px] rounded-full bg-secondary/5 blur-[130px] animate-pulse [animation-duration:8s]" />
        <div className="absolute bottom-[-100px] right-1/3 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px] animate-pulse [animation-duration:10s]" />
      </div>

      {/* الحاوية الحركية الرشيقة لصندوق التحقق */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        {/* البنية الخارجية الزجاجية الفخمة (Floating Glass Box) */}
        <div className="relative rounded-3xl border border-white/[0.05] bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-2xl p-8 md:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* خط الإضاءة الـ Crisp الأنيق أعلى الكارت */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* هيدر التحقق والتوجيه الأمني */}
          <div className="text-center mb-6">
            <div className="inline-flex w-11 h-11 bg-gradient-to-tr from-secondary to-[#BDD400] rounded-2xl items-center justify-center text-slate-950 font-black text-lg shadow-[0_4px_20px_rgba(228,255,0,0.15)] mb-3">
              M
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              توثيق الحساب الرقمي
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-sm mx-auto">
              لقد قمنا بإرسال رمز تأكيد مؤلف من 6 أرقام إلى بريدك الإلكتروني
              المودع:
            </p>
            {/* عرض البريد الإلكتروني بشكل فخم ومعزول التوجيه */}
            <span
              className="inline-block mt-2 text-xs font-mono font-bold text-secondary bg-secondary/5 border border-secondary/15 px-3 py-1 rounded-xl"
              dir="ltr"
            >
              {emailForOTP}
            </span>
          </div>

          {/* حقن فورمة الـ OTP الخاصة بك */}
          <VerifyOTPForm
            onSubmit={handleVerify}
            isLoading={isPending}
            email={emailForOTP}
          />

          {/* شارة الأمان السفلية لتعزيز قوة الـ Demo */}
          <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            <FiShield className="text-secondary/70" /> مسار Multi-Factor
            Authentication
          </div>
        </div>
      </motion.div>
    </div>
  );
}
