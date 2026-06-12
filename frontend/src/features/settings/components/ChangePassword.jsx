import { useChangePasswordLogic } from "../hooks/useChangePasswordLogic";
import { Button } from "../../../components";
import { FiLock, FiShield, FiKey } from "react-icons/fi"; // 🎯 حقن أيقونات ناعمة وراقية للمظهر الـ Premium

export default function ChangePassword() {
  const { register, handleSubmit, errors, onSubmit, isPending } =
    useChangePasswordLogic();

  return (
    // 🎯 أزلنا الـ bg الرمادي المكرر واعتمدنا التدرج النظيف وعمق الـ Dark Core ليتناسق مع إعدادات الحساب
    <div
      dir="rtl"
      className="bg-[#0D121A] border border-white/[0.05] rounded-2xl shadow-2xl overflow-hidden mt-8 text-right font-['Outfit'] relative"
    >
      {/* خط توهج علوي خفيف لحماية وتأمين الواجهة البصرية */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/10 to-transparent" />

      {/* هيدر الكارت */}
      <div className="p-6 md:p-8 border-b border-white/[0.05] bg-gradient-to-r from-white/[0.01] to-transparent">
        <h2 className="text-xl font-black text-white flex items-center gap-2.5">
          <FiLock className="text-secondary" /> تعديل وتحديث شفرة الحماية
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 font-light">
          يرجى تأكيد هوية حسابك عبر إدخال كلمة المرور الحالية لإنشاء شفرة دخول
          جديدة.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 md:p-8 space-y-5 text-xs md:text-sm"
      >
        {/* كلمة المرور الحالية */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <FiKey size={12} /> كلمة المرور الحالية
          </label>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className={`bg-slate-950 border ${errors.passwordCurrent ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-secondary"} rounded-xl p-3.5 text-slate-200 focus:outline-none transition-colors text-right`}
            {...register("passwordCurrent")}
          />
          {errors.passwordCurrent && (
            <span className="text-[11px] font-medium text-red-400 mt-0.5 block">
              ⚠️ {errors.passwordCurrent.message}
            </span>
          )}
        </div>

        {/* حقول كلمة المرور الجديدة والتأكيد كـ Grid متناسق */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* كلمة المرور الجديدة */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <FiLock size={12} /> كلمة المرور الجديدة
            </label>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className={`bg-slate-950 border ${errors.password ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-secondary"} rounded-xl p-3.5 text-slate-200 focus:outline-none transition-colors text-right`}
              {...register("password")}
            />
            {errors.password && (
              <span className="text-[11px] font-medium text-red-400 mt-0.5 block">
                ⚠️ {errors.password.message}
              </span>
            )}
          </div>

          {/* تأكيد كلمة المرور */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <FiShield size={12} /> تأكيد كلمة المرور الجديدة
            </label>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className={`bg-slate-950 border ${errors.passwordConfirm ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-secondary"} rounded-xl p-3.5 text-slate-200 focus:outline-none transition-colors text-right`}
              {...register("passwordConfirm")}
            />
            {errors.passwordConfirm && (
              <span className="text-[11px] font-medium text-red-400 mt-0.5 block">
                ⚠️ {errors.passwordConfirm.message}
              </span>
            )}
          </div>
        </div>

        {/* ذيل الفورم وزر الحفظ المطور */}
        <div className="pt-5 border-t border-white/[0.05] mt-6">
          <Button
            type="submit"
            variant="accent"
            className="w-full md:w-auto px-10 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(228,255,0,0.1)] hover:shadow-[0_10px_25px_rgba(228,255,0,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all text-slate-950"
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-t-transparent border-slate-950 rounded-full animate-spin" />
                <span>جاري تحديث وتشفير المفاتيح...</span>
              </div>
            ) : (
              "حفظ وتحديث كلمة المرور"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
