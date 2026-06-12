import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Input, Button } from "../../../components";
import { loginSchema } from "../../../utils/validation";
import { FiLock, FiLogIn } from "react-icons/fi";

export default function LoginForm({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  return (
    // 🎯 شيلنا الـ Wrapper الخارجي الضخم والحدود المكررة لأن صفحة الأب (Login.jsx) أصبحت تحتوي عليها بالفعل
    <div dir="rtl" className="w-full text-right font-['Outfit']">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* حقل البريد الإلكتروني المطور */}
        <div className="relative">
          <Input
            label="البريد الإلكتروني للحساب"
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            error={errors.email?.message}
            className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-secondary rounded-xl text-slate-200 text-xs md:text-sm"
          />
        </div>

        {/* حقل كلمة المرور مع رابط الاستعادة */}
        <div className="space-y-2 relative">
          <Input
            label="كلمة المرور السرية"
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            error={errors.password?.message}
            className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-secondary rounded-xl text-slate-200 text-xs md:text-sm"
          />

          {/* 🎯 تم تعديل مكان رابط "نسيت كلمة المرور" ليصبح على اليمين موازياً لبداية الحقل العربي الأنيق */}
          <div className="text-right pr-1">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-secondary/80 hover:text-white transition-colors flex items-center gap-1 w-fit"
            >
              <FiLock size={12} /> نسيت كلمة المرور؟
            </Link>
          </div>
        </div>

        {/* زر الإطلاق والSubmit المتوهج */}
        <Button
          type="submit"
          variant="accent"
          className="w-full mt-6 py-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(228,255,0,0.1)] hover:shadow-[0_10px_25px_rgba(228,255,0,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 text-slate-950"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-t-transparent border-slate-950 rounded-full animate-spin" />
              <span>جاري فحص وتشفير البيانات...</span>
            </>
          ) : (
            <>
              <FiLogIn />
              <span>اعتماد وتسجيل الدخول</span>
            </>
          )}
        </Button>
      </form>

      {/* رابط التنقل للتسجيل المطور بالأسفل */}
      <div className="mt-8 text-center border-t border-white/[0.04] pt-4">
        <p className="text-xs text-slate-400 font-light">
          ليس لديك حساب موثق بالمنظومة؟{" "}
          <Link
            to="/register"
            className="text-secondary font-bold hover:underline"
          >
            إنشاء حساب جديد الآن
          </Link>
        </p>
      </div>
    </div>
  );
}
