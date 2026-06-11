import { useNavigate } from "react-router-dom"; // 🚀 للتوجيه لمساعد الـ AI
import { useFreelancerSettingsLogic } from "../features/settings/hooks/useFreelancerSettingsLogic";
import { Button } from "../components";
import ChangePassword from "../features/settings/components/ChangePassword";
import {
  FiUser,
  FiBriefcase,
  FiCpu,
  FiGithub,
  FiFileText,
  FiSave,
  FiGlobe,
  FiPlus,
  FiX,
} from "react-icons/fi"; // أيقونات ناعمة وراقية

export default function FreelancerSettings() {
  const navigate = useNavigate();
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
    portfolioLinks,
    portfolioInput,
    setPortfolioInput,
    handleAddPortfolioLink,
    handleRemovePortfolioLink,
  } = useFreelancerSettingsLogic();

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-secondary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 mt-16 max-w-3xl font-['Outfit']">
      {/* هيدر الكارت الزجاجي النظيف */}
      <div className="bg-primary border border-white/[0.04] rounded-2xl shadow-2xl overflow-hidden mb-8 backdrop-blur-md">
        <div className="p-8 border-b border-white/[0.04] bg-slate-900/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-heading flex items-center gap-2.5">
              <FiUser className="text-secondary text-xl" /> إعدادات الحساب
            </h1>
            <p className="text-xs text-slate-400 mt-1.5">
              قم بتحديث بياناتك الشخصية وبناء ملفك المهني على منصة مسار
            </p>
          </div>

          {/* 👑 تحديث زرار التوجيه لمساعد الـ AI جوه ملف FreelancerSettings.jsx */}
          <button
            type="button"
            onClick={() => {
              // 🎯 لقطة احترافية: سحب الداتا الحية مباشرة من متغيرات الـ Hook اللي جاي من useForm
              // مفيش حاجة هتضيع أو تطلع فاضية بعد كدة!
              const currentBio =
                document.querySelector('textarea[name="bio"]')?.value || "";
              const currentGithub =
                document.querySelector('input[name="githubLink"]')?.value || "";

              navigate("/freelancer-settings/portfolio-analyzer", {
                state: {
                  portfolio_text: currentBio,
                  github_url: currentGithub,

                  // 🚀 الـ Fix القاتل: بناخد أول عنصر في المصفوفة الحية اللي راجعة من الـ Hook فوراً
                  portfolio_url:
                    portfolioLinks && portfolioLinks.length > 0
                      ? portfolioLinks[0]
                      : "",
                  hasCv,
                },
              });
            }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/30 text-secondary text-xs font-bold px-4 py-2.5 rounded-xl hover:from-secondary/20 hover:to-secondary/10 transition-all duration-300"
          >
            <FiCpu className="animate-pulse" /> مراجعة وتحسين البروفايل بالـ AI
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* الاسم بالكامل */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 tracking-wide">
              الاسم بالكامل
            </label>
            <input
              type="text"
              className="bg-slate-950 border border-white/[0.05] rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-secondary/40 transition-colors"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-[11px] text-red-400 mt-1">
                ⚠️ {errors.name.message}
              </span>
            )}
          </div>

          {/* الملف المهني */}
          <h2 className="text-sm font-bold text-secondary border-b border-white/[0.04] pb-2 pt-4 flex items-center gap-2">
            <FiBriefcase /> تفاصيل الملف المهني
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-300 tracking-wide">
                المسمى الوظيفي
              </label>
              <input
                type="text"
                placeholder="مثال: Full-Stack Developer"
                className="bg-slate-950 border border-white/[0.05] rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-secondary/40 transition-colors"
                {...register("title")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-300 tracking-wide">
                سعر الساعة ($)
              </label>
              <input
                type="number"
                className="bg-slate-950 border border-white/[0.05] rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-secondary/40 transition-colors"
                {...register("hourlyRate")}
              />
            </div>
          </div>

          {/* النبذة التعريفية */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 tracking-wide">
              النبذة التعريفية (Bio)
            </label>
            <textarea
              rows="4"
              className="w-full bg-slate-950 border border-white/[0.05] rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-secondary/40 resize-none leading-relaxed"
              {...register("bio")}
            ></textarea>
          </div>

          {/* المهارات الحركية التفاعلية */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 tracking-wide">
              المهارات (اضغط Enter للإضافة الحية)
            </label>
            <div className="bg-slate-950 border border-white/[0.05] rounded-xl p-3 min-h-[52px] flex flex-wrap gap-2 focus-within:border-secondary/40 transition-colors">
              {currentSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-white/[0.02] text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 border border-white/[0.04]"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-500 hover:text-red-400 font-bold text-sm transition-colors"
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
                placeholder={
                  currentSkills.length === 0 ? "مثال: Next.js, TypeScript" : ""
                }
                className="bg-transparent border-none outline-none text-slate-200 text-xs flex-1 min-w-[140px] px-2"
              />
            </div>
          </div>

          {/* روابط جيت هاب */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 tracking-wide flex items-center gap-1.5">
              <FiGithub size={13} /> رابط حساب GitHub
            </label>
            <input
              type="url"
              placeholder="https://github.com/username"
              className="bg-slate-950 border border-white/[0.05] rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-secondary/40"
              {...register("githubLink")}
            />
          </div>

          {/* 🎯 👑 إضافة حقل الـ Portfolio Links التفاعلي الجديد بالملي هنا */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 tracking-wide flex items-center gap-1.5">
              <FiGlobe size={13} /> روابط معرض الأعمال (Portfolio Links)
            </label>

            {/* عرض الروابط المضافة كـ Tags زجاجية راقية */}
            <div className="flex flex-col gap-2 mb-2">
              {portfolioLinks.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white/[0.01] border border-white/[0.04] p-3 rounded-xl text-xs text-slate-300 transition-all hover:border-white/[0.08]"
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary hover:underline truncate max-w-[85%]"
                  >
                    {link}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemovePortfolioLink(link)}
                    className="p-1 text-slate-500 hover:text-red-400 rounded-lg hover:bg-white/[0.02] transition-all"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* حقل الإدخال الذكي مع زرار الزائد المدمج */}
            <div className="relative flex items-center">
              <input
                type="url"
                value={portfolioInput}
                onChange={(e) => setPortfolioInput(e.target.value)}
                onKeyDown={handleAddPortfolioLink}
                placeholder="اضغط Enter أو + لإضافة رابط مثل: https://behance.net/username"
                className="w-full bg-slate-950 border border-white/[0.05] rounded-xl p-3.5 pl-12 text-xs text-slate-200 focus:outline-none focus:border-secondary/40 transition-colors"
              />
              <button
                type="button"
                onClick={handleAddPortfolioLink}
                className="absolute left-3 p-2 bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-secondary rounded-lg transition-colors"
              >
                <FiPlus size={14} />
              </button>
            </div>
          </div>

          {/* السيرة الذاتية */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 tracking-wide flex items-center gap-1.5">
              <FiFileText size={13} /> السيرة الذاتية (CV)
            </label>

            {hasCv && (
              <div className="text-secondary text-xs font-medium bg-secondary/5 border border-secondary/10 px-3 py-2 rounded-xl w-fit mb-1 flex items-center gap-1.5">
                ✨ تم رفع وتوثيق السيرة الذاتية بنجاح على الخادم
              </div>
            )}

            <input
              type="file"
              accept=".pdf"
              className="bg-slate-950 border border-white/[0.05] rounded-xl p-3 text-xs text-slate-400 file:bg-white/[0.03] file:border file:border-white/[0.06] file:text-slate-200 file:rounded-lg file:px-3 file:py-1 file:ml-3 file:cursor-pointer hover:file:bg-white/[0.05] file:transition-colors"
              {...register("cv")}
            />
          </div>

          {/* زر الحفظ */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="accent"
              className="w-full md:w-auto px-10 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-secondary/10"
              disabled={isPending}
            >
              <FiSave />
              {isPending ? "جاري ترحيل التعديلات..." : "حفظ التعديلات الفورية"}
            </Button>
          </div>
        </form>
      </div>

      {/* كامبوننت تغيير الباسورد المستقر */}
      <ChangePassword />
    </div>
  );
}
