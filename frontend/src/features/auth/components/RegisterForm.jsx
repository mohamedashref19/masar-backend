import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Input, Button } from "../../../components";
import { registerSchema } from "../../../utils/validation";

export default function RegisterForm({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch("role");

  const submitHandler = (data) => {
    // تنسيق الـ Payload ليطابق متطلبات الباك إند
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

    // إرسال البيانات للصفحة الأب
    onSubmit(payload);
  };

  return (
    <div className="w-full max-w-md bg-primary p-8 rounded-xl border border-slate-800 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-heading">إنشاء حساب جديد</h1>
      </div>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        <Input
          label="الاسم الكامل"
          id="name"
          {...register("name")}
          error={errors.name?.message}
        />

        <Input
          label="البريد الإلكتروني"
          id="email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-heading">
            نوع الحساب
          </label>
          <div className="flex gap-4">
            <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-700 rounded-md cursor-pointer hover:border-secondary transition-all has-[:checked]:border-secondary has-[:checked]:bg-secondary/10 text-body has-[:checked]:text-white">
              <input
                type="radio"
                value="client"
                {...register("role")}
                className="hidden"
              />
              <span>صاحب عمل</span>
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-700 rounded-md cursor-pointer hover:border-secondary transition-all has-[:checked]:border-secondary has-[:checked]:bg-secondary/10 text-body has-[:checked]:text-white">
              <input
                type="radio"
                value="freelancer"
                {...register("role")}
                className="hidden"
              />
              <span>مستقل</span>
            </label>
          </div>
          {errors.role && (
            <span className="text-red-500 text-sm">{errors.role.message}</span>
          )}
        </div>

        {selectedRole === "client" && (
          <Input
            label="اسم الشركة"
            id="companyName"
            placeholder="مثال: GrowthNodes"
            {...register("companyName")}
            error={errors.companyName?.message}
          />
        )}

        {selectedRole === "freelancer" && (
          <Input
            label="المسمى الوظيفي"
            id="title"
            placeholder="مثال: Frontend Developer"
            {...register("title")}
            error={errors.title?.message}
          />
        )}

        <Input
          label="كلمة المرور"
          id="password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />

        <Input
          label="تأكيد كلمة المرور"
          id="passwordConfirm"
          type="password"
          {...register("passwordConfirm")}
          error={errors.passwordConfirm?.message}
        />

        <Button
          type="submit"
          variant="accent"
          className="w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? "جاري التسجيل..." : "إنشاء الحساب"}
        </Button>
      </form>

      <p className="text-center mt-6 text-body text-sm">
        لديك حساب بالفعل؟{" "}
        <Link to="/login" className="text-secondary hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
