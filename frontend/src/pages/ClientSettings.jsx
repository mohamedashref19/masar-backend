import { useClientSettingsLogic } from "../features/settings/hooks/useClientSettingsLogic";
import { Button } from "../components";
import ChangePassword from "../features/settings/components/ChangePassword";
import { FiSettings, FiUser, FiCheckCircle } from "react-icons/fi";

export default function ClientSettings() {
  // 🎯 استخراج الحقول المسجلة في الـ logic hook المحدث
  const { register, handleSubmit, errors, onSubmit, isPending, isFetching } =
    useClientSettingsLogic();

  if (isFetching) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#080B10] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
        <span className="text-xs text-slate-500 font-medium">
          جاري سحب بيانات الحساب المؤمنة...
        </span>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="container mx-auto py-12 px-4 mt-20 max-w-3xl text-right relative selection:bg-secondary/30"
    >
      {/* هالة إضاءة خلفية خفيفة */}
      <div className="absolute top-10 right-1/4 w-80 h-80 rounded-full bg-secondary/[0.02] blur-[120px] pointer-events-none" />

      <div className="bg-[#0D121A] border border-white/[0.05] rounded-2xl shadow-2xl overflow-hidden relative mb-8">
        {/* هيدر الإعدادات */}
        <div className="p-6 md:p-8 border-b border-white/[0.05] bg-gradient-to-r from-white/[0.01] to-transparent flex items-center gap-3">
          <div className="p-3 bg-secondary/10 border border-secondary/20 text-secondary rounded-xl text-xl">
            <FiSettings />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">
              إعدادات ملف العميل
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              قم بتحديث بياناتك الشخصية الأساسية لتأمين الهوية الرقمية لحسابك.
            </p>
          </div>
        </div>

        {/* فورم التحديث */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 md:p-8 space-y-6 text-sm"
        >
          {/* قسم البيانات الشخصية الأساسية */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-secondary flex items-center gap-1.5 uppercase tracking-wider mb-2">
              <FiUser /> البيانات الأساسية
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400">
                الاسم بالكامل
              </label>
              <input
                type="text"
                autoComplete="off"
                className={`w-full bg-slate-950 border ${errors.name ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-secondary"} rounded-xl p-3 text-slate-200 focus:outline-none transition-colors text-right`}
                {...register("name")}
              />
              {errors.name && (
                <span className="text-[11px] font-medium text-red-400 mt-0.5 block">
                  ⚠️ {errors.name.message}
                </span>
              )}
            </div>
          </div>

          {/* 🎯 تم حجب حقول المنشأة مؤقتاً لضمان استقرار تدفق الـ Demo لايف أمام اللجنة */}
          {/* <div className="pt-6 border-t border-white/[0.03] space-y-4">
            <h3 className="text-xs font-bold text-secondary flex items-center gap-1.5 uppercase tracking-wider mb-2">
              <FiBriefcase /> الملف التجاري والمنشأة
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400">
                  اسم الشركة / المؤسسة
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl p-3 text-slate-200 focus:outline-none transition-colors text-right"
                  {...register("clientProfile.companyName")}
                  placeholder="مثال: مسار لتقنية المعلومات"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400">
                  مجال وتخصص العمل
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl p-3 text-slate-200 focus:outline-none transition-colors text-right"
                  {...register("clientProfile.industry")}
                  placeholder="مثال: البرمجيات، التجارة الإلكترونية"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400">
                نبذة تعريفية عن نشاط العميل
              </label>
              <textarea
                rows="3"
                className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl p-3 text-slate-200 focus:outline-none transition-colors resize-none leading-relaxed text-right"
                {...register("clientProfile.description")}
                placeholder="اكتب وصفاً مختصراً لشركتك لتعزيز ثقة المستقلين..."
              />
            </div>
          </div> 
          */}

          {/* زرار الحفظ الفخم المطور ستايله سيبرانياً */}
          <div className="pt-6 border-t border-white/[0.05] flex justify-start">
            <Button
              type="submit"
              variant="accent"
              className="w-full md:w-auto px-8 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_10px_25px_rgba(228,255,0,0.1)] hover:shadow-[0_10px_25px_rgba(228,255,0,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-slate-950"
              disabled={isPending}
            >
              <FiCheckCircle size={15} />{" "}
              {isPending
                ? "جاري حفظ التغييرات الحين..."
                : "حفظ التعديلات الفورية"}
            </Button>
          </div>
        </form>
      </div>

      {/* شقة تغيير كلمة المرور المنفصلة بالأسفل */}
      <ChangePassword />
    </div>
  );
}
