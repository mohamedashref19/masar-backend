import { useClientSettingsLogic } from "../features/settings/hooks/useClientSettingsLogic";
import { Button } from "../components";
import ChangePassword from "../features/settings/components/ChangePassword";

export default function ClientSettings() {
  // 🎯 استخرجنا isFetching من الهوك
  const { register, handleSubmit, errors, onSubmit, isPending, isFetching } =
    useClientSettingsLogic();

  // 🎯 عرض لودينج لحد ما الداتا الحقيقية تيجي
  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-12 px-4 mt-16 max-w-3xl">
        <div className="bg-primary border border-slate-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-slate-800 bg-slate-900/50">
            <h1 className="text-3xl font-bold text-heading">إعدادات الحساب</h1>
            <p className="text-slate-400 mt-2">قم بتحديث بياناتك الشخصية</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">
                الاسم بالكامل
              </label>
              <input
                type="text"
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary transition-colors"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-xs text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Button
                type="submit"
                variant="accent"
                className="w-full md:w-auto px-10"
                disabled={isPending}
              >
                {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
              </Button>
            </div>
          </form>
        </div>
        <ChangePassword />
      </div>
    </>
  );
}
