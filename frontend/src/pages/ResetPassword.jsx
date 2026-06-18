import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import Swal from "sweetalert2";
import api from "../services/api"; // تأكد من مسار الـ axios instance
import { Button } from "../components"; // استيراد زرار "مسار" الفخم
import { FiLock, FiShield, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

// 🎯 1. تعريف شروط التحقق (Schema) لضمان القوة والأمان
const resetSchema = z
  .object({
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),

    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "كلمات المرور غير متطابقة",
    path: ["passwordConfirm"],
  });

export default function ResetPassword() {
  const { token } = useParams(); // لقط التوكن من الرابط
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  // 🚀 2. دالة إرسال الطلب النهائي للباك إند
  const onSubmit = async (data) => {
    try {
      const response = await api.patch(`/users/resetPassword/${token}`, {
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      });

      if (response.data.status === "success") {
        Swal.fire({
          title: "تم تأمين الحساب! 🔐",
          text: "تمت إعادة تعيين كلمة المرور بنجاح. يمكنك الدخول الآن.",
          icon: "success",
          background: "#0D121A",
          color: "#fff",
          confirmButtonColor: "#E4FF00",
          confirmButtonText:
            "<span style='color: #080B10; font-weight: bold;'>تسجيل الدخول</span>",
        }).then(() => {
          navigate("/login");
        });
      }
    } catch (err) {
      Swal.fire({
        title: "فشل الإجراء ⚠️",
        text:
          err.response?.data?.message || "انتهت صلاحية الرابط أو أنه غير صالح.",
        icon: "error",
        background: "#0D121A",
        color: "#fff",
        confirmButtonColor: "#f87171",
      });
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#080B10] flex items-center justify-center p-4 font-['Outfit']"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-secondary/5 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0D121A] border border-white/[0.05] rounded-3xl shadow-2xl p-8 relative overflow-hidden"
      >
        {/* هيدر الصفحة */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiShield className="text-secondary text-3xl" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">
            إعادة تعيين المرور
          </h1>
          <p className="text-slate-400 text-sm">
            أدخل كلمة المرور الجديدة لتأمين وصولك لمنصة مسار.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* حقل الباسورد الجديد */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 flex items-center gap-2">
              <FiLock size={14} /> كلمة المرور الجديدة
            </label>
            <input
              type="password"
              {...register("password")}
              className={`w-full bg-slate-950 border ${errors.password ? "border-red-500" : "border-white/10"} rounded-xl p-3.5 text-white focus:outline-none focus:border-secondary transition-all`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-[10px] text-red-400 font-bold tracking-wide">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* حقل التأكيد */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 flex items-center gap-2">
              <FiLock size={14} /> تأكيد كلمة المرور
            </label>
            <input
              type="password"
              {...register("passwordConfirm")}
              className={`w-full bg-slate-950 border ${errors.passwordConfirm ? "border-red-500" : "border-white/10"} rounded-xl p-3.5 text-white focus:outline-none focus:border-secondary transition-all`}
              placeholder="••••••••"
            />
            {errors.passwordConfirm && (
              <p className="text-[10px] text-red-400 font-bold tracking-wide">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="accent"
            className="w-full py-4 text-slate-950"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري التأمين..." : "تحديث كلمة المرور الحين"}
          </Button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full text-slate-500 text-xs font-bold hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            الرجوع لتسجيل الدخول <FiArrowRight className="rotate-180" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
