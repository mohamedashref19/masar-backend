import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Input, Button } from "../../../components";
import { loginSchema } from "../../../utils/validation";

export default function LoginForm({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="w-full max-w-md bg-primary p-8 rounded-xl border border-slate-800 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-heading">مرحباً بعودتك</h1>
        <p className="text-body mt-2 text-sm">
          سجل دخولك لمتابعة أعمالك على مسار
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="البريد الإلكتروني"
          id="email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <div className="space-y-1">
          <Input
            label="كلمة المرور"
            id="password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
          <div className="text-left mt-1">
            <Link
              to="/forgot-password"
              className="text-sm text-secondary hover:underline"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="accent"
          className="w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? "جاري الدخول..." : "تسجيل الدخول"}
        </Button>
      </form>

      <p className="text-center mt-6 text-body text-sm">
        ليس لديك حساب؟{" "}
        <Link to="/register" className="text-secondary hover:underline">
          إنشاء حساب جديد
        </Link>
      </p>
    </div>
  );
}
