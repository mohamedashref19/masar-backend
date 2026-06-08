import { useFreelancerSettingsLogic } from "../features/settings/hooks/useFreelancerSettingsLogic";
import { Button } from "../components";
import ChangePassword from "../features/settings/components/ChangePassword";

export default function FreelancerSettings() {
  const {
    register,
    handleSubmit,
    errors,
    hasCv,
    onSubmit,
    isPending,
    currentSkills,
    skillInput,
    setSkillInput,
    handleAddSkill,
    handleRemoveSkill,
    isFetching,
  } = useFreelancerSettingsLogic();

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 mt-16 max-w-3xl">
      <div className="bg-primary border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-800 bg-slate-900/50">
          <h1 className="text-3xl font-bold text-heading">إعدادات الحساب</h1>
          <p className="text-slate-400 mt-2">
            قم بتحديث بياناتك الشخصية وملفك المهني
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          {/* البيانات الأساسية */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">
              الاسم بالكامل
            </label>
            <input
              type="text"
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-xs text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-secondary border-b border-slate-800 pb-2">
            الملف المهني
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">
                المسمى الوظيفي
              </label>
              <input
                type="text"
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary"
                {...register("title")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">
                سعر الساعة ($)
              </label>
              <input
                type="number"
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary"
                {...register("hourlyRate")}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">
              النبذة التعريفية
            </label>
            <textarea
              rows="4"
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary resize-none"
              {...register("bio")}
            ></textarea>
          </div>
          {/* المهارات */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">
              المهارات (اضغط Enter للإضافة)
            </label>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 min-h-[50px] flex flex-wrap gap-2 focus-within:border-secondary">
              {currentSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-slate-800 text-slate-200 px-3 py-1 rounded-md text-sm flex items-center gap-2 border border-slate-600"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-400 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder={currentSkills.length === 0 ? "مثال: React.js" : ""}
                className="bg-transparent border-none outline-none text-slate-200 flex-1 min-w-[120px]"
              />
            </div>
          </div>
          {/* رابط GitHub */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">
              رابط GitHub
            </label>
            <input
              type="url"
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200"
              {...register("githubLink")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">
              السيرة الذاتية (CV)
            </label>

            {/* عرض اللينك لو موجود في الـ userData */}
            {hasCv && (
              <div className="text-secondary text-sm mb-2">
                ✅ تم رفع السيرة الذاتية بالفعل
              </div>
            )}

            <input
              type="file"
              accept=".pdf"
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 file:bg-secondary file:border-none file:text-white file:rounded-md file:px-3 file:py-1"
              {...register("cv")}
            />
          </div>
          <Button
            type="submit"
            variant="accent"
            className="w-full md:w-auto px-10"
            disabled={isPending}
          >
            {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
          </Button>
        </form>
      </div>
      <ChangePassword />
    </div>
  );
}
