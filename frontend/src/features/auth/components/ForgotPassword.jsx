import { useState } from "react";
import { motion } from "framer-motion";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { FiMail, FiArrowLeft, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // 🎯 استيراد الـ Swal لتقديم إشعار سيبراني فخم للجنة بكرة

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  // 🎯 حقن الـ Handlers مباشرة داخل الـ Hook لإصدار التنبيه فوراً بدلاً من الـ Navigation
  const { mutate: sendOTP, isPending } = useForgotPassword({
    onSuccess: () => {
      Swal.fire({
        title: "تفقد بريدك الإلكتروني! 📧",
        text: `تم إرسال رابط تأمين وإعادة تعيين كلمة المرور بنجاح إلى: ${email}، الرابط صالح لمدة 10 دقائق.`,
        icon: "success",
        background: "#0D121A",
        color: "#fff",
        confirmButtonColor: "#E4FF00", // لون براند مسار المضيء
        confirmButtonText:
          "<span style='color: #080B10; font-weight: bold;'>حسناً ⚙️</span>",
        customClass: {
          popup: "border border-white/[0.05] rounded-2xl font-sans",
        },
      });
      setEmail(""); // تفريغ الحقل لشياكة الـ UI بعد النجاح
    },
    onError: (err) => {
      Swal.fire({
        title: "فشل الإجراء ⚠️",
        text:
          err.response?.data?.message ||
          "لم نجد حساباً مسجلاً بهذا البريد الإلكتروني.",
        icon: "error",
        background: "#0D121A",
        color: "#fff",
        confirmButtonColor: "#f87171",
        confirmButtonText: "محاولة أخرى",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // تمرير طلب فك التشفير
      sendOTP(email);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-[#080B10] px-4 py-12 relative overflow-hidden text-right selection:bg-secondary/30 font-['Outfit']"
    >
      {/* 🌌 تأثيرات الإضاءة المحيطية العميقة */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 right-1/4 h-[450px] w-[450px] rounded-full bg-secondary/5 blur-[130px] animate-pulse [animation-duration:7s]" />
      </div>

      {/* الحاوية الحركية لـ كارد استعادة كلمة المرور */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        {/* البنية الخارجية الزجاجية الفخمة */}
        <div className="relative rounded-3xl border border-white/[0.05] bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-2xl p-8 md:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* خط الإضاءة أعلى الكارت */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* هيدر التوجيه والاستعادة */}
          <div className="text-center mb-8">
            <div className="inline-flex w-12 h-12 bg-gradient-to-tr from-secondary to-[#BDD400] rounded-2xl items-center justify-center text-slate-950 font-black text-xl shadow-[0_4px_20px_rgba(228,255,0,0.15)] mb-4">
              <FiLock size={20} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              نسيت كلمة السر؟
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-sm mx-auto">
              لا تقلق، أدخل بريدك الإلكتروني المعتمد وسيقوم نظام مسار بإرسال
              رابط آمن وممكّن بالـ AI لإعادة تعيين الهوية الرقمية لحسابك فوراً.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-sm">
            {/* حقل البريد الإلكتروني المطور */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 mb-0.5 mr-1">
                البريد الإلكتروني للحساب
              </label>
              <div className="relative flex items-center">
                <FiMail className="absolute right-4 text-slate-500" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl py-3.5 pr-12 pl-4 text-slate-200 focus:outline-none transition-colors text-right font-sans text-xs md:text-sm"
                />
              </div>
            </div>

            {/* زر الإرسال المطور */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-secondary text-slate-950 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(228,255,0,0.1)] hover:shadow-[0_10px_25px_rgba(228,255,0,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 group"
            >
              <span>
                {isPending
                  ? "جاري تشفير وترحيل الطلب..."
                  : "إرسال رابط استعادة المرور"}
              </span>
              {!isPending && (
                <FiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
              )}
            </button>
          </form>

          {/* تذييل الكارد للعودة */}
          <div className="mt-8 text-center border-t border-white/[0.04] pt-4">
            <Link
              to="/login"
              className="text-xs font-medium text-slate-500 hover:text-white transition-colors"
            >
              ← العودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
