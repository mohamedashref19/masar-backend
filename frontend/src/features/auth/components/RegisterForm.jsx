import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Input, Button } from "../../../components";
import { registerSchema } from "../../../utils/validation";
import {
  FiUserCheck,
  FiBriefcase,
  FiBriefcase as FiCompany,
  FiUserPlus,
} from "react-icons/fi";

export default function RegisterForm({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "freelancer", // وضع قيمة افتراضية لتأمين الـ UX من أول ثانية
    },
  });

  const selectedRole = watch("role");

  const submitHandler = (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
      role: data.role,
    };

    if (data.role === "client") {
      payload.clientProfile = { companyName: data.companyName };
    } else if (data.role === "freelancer") {
      payload.freelancerProfile = { title: data.title };
    }

    onSubmit(payload);
  };

  return (
    // 🎯 تم إزالة حاوية الـ Card والمقاسات الضيقة المكررة ليتداخل المكون بانسيابية مطلقة داخل زجاج الأب (Register.jsx)
    <div dir="rtl" className="w-full text-right font-['Outfit']">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="space-y-4 text-xs md:text-sm"
      >
        {/* حقل الاسم بالكامل */}
        <Input
          label="الاسم بالكامل"
          id="name"
          placeholder="مثال: كريم أشرف"
          {...register("name")}
          error={errors.name?.message}
          className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-secondary rounded-xl text-slate-200"
        />

        {/* حقل البريد الإلكتروني */}
        <Input
          label="البريد الإلكتروني"
          id="email"
          type="email"
          placeholder="name@example.com"
          {...register("email")}
          error={errors.email?.message}
          className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-secondary rounded-xl text-slate-200"
        />

        {/* 🎯 قسم اختيار نوع الحساب المطور كـ Premium Radio Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-400 mb-1">
            طبيعة وهوية الحساب الرقمي
          </label>
          <div className="flex gap-4">
            {/* خيار صاحب العمل */}
            <label className="flex-1 flex flex-col items-center justify-center gap-2 p-4 border border-white/[0.08] bg-slate-950/20 rounded-xl cursor-pointer hover:border-secondary/40 hover:bg-white/[0.02] transition-all has-[:checked]:border-secondary has-[:checked]:bg-secondary/5 text-slate-400 has-[:checked]:text-white group">
              <input
                type="radio"
                value="client"
                {...register("role")}
                className="hidden"
              />
              <FiCompany
                className="text-slate-500 group-hover:text-secondary transition-colors"
                size={18}
              />
              <span className="text-xs font-bold">صاحب عمل (Client)</span>
            </label>

            {/* خيار المستقل */}
            <label className="flex-1 flex flex-col items-center justify-center gap-2 p-4 border border-white/[0.08] bg-slate-950/20 rounded-xl cursor-pointer hover:border-secondary/40 hover:bg-white/[0.02] transition-all has-[:checked]:border-secondary has-[:checked]:bg-secondary/5 text-slate-400 has-[:checked]:text-white group">
              <input
                type="radio"
                value="freelancer"
                {...register("role")}
                className="hidden"
              />
              <FiBriefcase
                className="text-slate-500 group-hover:text-secondary transition-colors"
                size={18}
              />
              <span className="text-xs font-bold">مستقل (Freelancer)</span>
            </label>
          </div>
          {errors.role && (
            <span className="text-[11px] font-medium text-red-400 mt-1 block">
              ⚠️ {errors.role.message}
            </span>
          )}
        </div>

        {/* حقول تبديل الأدوار الديناميكية (Conditional Fields) */}
        {selectedRole === "client" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            <Input
              label="اسم الشركة أو المنشأة"
              id="companyName"
              placeholder="مثال: GrowthNodes"
              {...register("companyName")}
              error={errors.companyName?.message}
              className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-secondary rounded-xl text-slate-200"
            />
          </div>
        )}

        {selectedRole === "freelancer" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            <Input
              label="المسمى الوظيفي التقني"
              id="title"
              placeholder="مثال: Frontend Developer"
              {...register("title")}
              error={errors.title?.message}
              className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-secondary rounded-xl text-slate-200"
            />
          </div>
        )}

        {/* حقول كلمات المرور */}
        <Input
          label="كلمة المرور السرية"
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
          className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-secondary rounded-xl text-slate-200"
        />

        <Input
          label="تأكيد كلمة المرور"
          id="passwordConfirm"
          type="password"
          placeholder="••••••••"
          {...register("passwordConfirm")}
          error={errors.passwordConfirm?.message}
          className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-secondary rounded-xl text-slate-200"
        />

        {/* زر الترحيل والتسجيل المتوهج */}
        <Button
          type="submit"
          variant="accent"
          className="w-full mt-6 py-3.5 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(228,255,0,0.1)] hover:shadow-[0_10px_25px_rgba(228,255,0,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 text-slate-950"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-t-transparent border-slate-950 rounded-full animate-spin" />
              <span>جاري تشفير المستندات وإرسال الـ OTP...</span>
            </>
          ) : (
            <>
              <FiUserPlus />
              <span>اعتماد وإنشاء الحساب الرقمي</span>
            </>
          )}
        </Button>
      </form>

      {/* الرابط السفلي للعودة */}
      <div className="mt-6 text-center border-t border-white/[0.04] pt-4">
        <p className="text-xs text-slate-400 font-light">
          لديك حساب موثق بالمنظومة بالفعل؟{" "}
          <Link
            to="/login"
            className="text-secondary font-bold hover:underline"
          >
            تسجيل الدخول المباشر
          </Link>
        </p>
      </div>
    </div>
  );
}
