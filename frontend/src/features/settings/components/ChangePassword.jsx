import { useChangePasswordLogic } from "../hooks/useChangePasswordLogic";
import { Button } from "../../../components";

export default function ChangePassword() {
  const { register, handleSubmit, errors, onSubmit, isPending } =
    useChangePasswordLogic();

  return (
    <div className="bg-primary border border-slate-800 rounded-xl shadow-xl overflow-hidden mt-8">
      <div className="p-8 border-b border-slate-800 bg-slate-900/50">
        <h2 className="text-2xl font-bold text-heading">تغيير كلمة المرور</h2>
        <p className="text-slate-400 mt-2">
          يرجى إدخال كلمة المرور الحالية لإنشاء واحدة جديدة
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">
            كلمة المرور الحالية
          </label>
          <input
            type="password"
            className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary transition-colors"
            {...register("passwordCurrent")}
          />
          {errors.passwordCurrent && (
            <span className="text-xs text-red-500">
              {errors.passwordCurrent.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">
              كلمة المرور الجديدة
            </label>
            <input
              type="password"
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary transition-colors"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-xs text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary transition-colors"
              {...register("passwordConfirm")}
            />
            {errors.passwordConfirm && (
              <span className="text-xs text-red-500">
                {errors.passwordConfirm.message}
              </span>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <Button
            type="submit"
            variant="accent"
            className="w-full md:w-auto px-10"
            disabled={isPending}
          >
            {isPending ? "جاري التغيير..." : "تحديث كلمة المرور"}
          </Button>
        </div>
      </form>
    </div>
  );
}
