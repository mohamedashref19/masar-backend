import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // 🎯 لقط حالة الـ user لمعرفة الـ isSpam لايف
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
  FiAlertTriangle,
} from "react-icons/fi";

export default function FreelancerSettings() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // سحب بيانات الفريلانسر الحالي

  // لقطة الـ Spam الحية من البروفايل المعزز بالـ AI
  const isSpamActive = user?.freelancerProfile?.isSpam ?? false;

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
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#080B10] gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-secondary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          جاري جلب وثائق المستقل المؤمنة...
        </span>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="container mx-auto py-12 px-4 mt-20 max-w-3xl text-right relative selection:bg-secondary/30 font-['Outfit']"
    >
      {/* 🚨 1. ميكانيزم البانر التحذيري للـ AI Anti-Spam - هيبهر اللجنة بكرة */}
      {isSpamActive && (
        <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-pulse">
          <div className="p-2 bg-red-500/10 text-red-400 rounded-xl text-lg shrink-0">
            <FiAlertTriangle />
          </div>
          <div>
            <h3 className="text-red-400 font-bold text-sm">
              الملف الشخصي غير موثق (قيد الحظر المؤقت)
            </h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              تم تصنيف حسابك كـ Spam أو غير مكتمل الداتا بواسطة خوارزمية مسار.
              يرجى رفع سيرتك الذاتية (CV) بصيغة PDF وتحديث النبذة والمهارات
              فوراً، ليقوم الـ AI بإعادة تحليل حسابك وإيقاف الحظر تلقائياً
              لتتمكن من تقديم عروضك.
            </p>
          </div>
        </div>
      )}

      {/* الهيكل الزجاجي للملف الشخصي */}
      <div className="bg-[#0D121A] border border-white/[0.05] rounded-2xl shadow-2xl overflow-hidden mb-8 relative">
        <div className="p-6 md:p-8 border-b border-white/[0.05] bg-gradient-to-r from-white/[0.01] to-transparent flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
              <FiUser className="text-secondary" /> إعدادات الحساب والتوثيق
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              قم بتحديث بياناتك الشخصية وبناء ملفك المهني لفك فحص الـ Spam بالـ
              AI.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 md:p-8 space-y-6 text-sm"
        >
          {/* الاسم بالكامل */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400">
              الاسم بالكامل
            </label>
            <input
              type="text"
              autoComplete="off"
              className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none transition-colors text-right"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-[11px] font-medium text-red-400 mt-1 block">
                ⚠️ {errors.name.message}
              </span>
            )}
          </div>

          {/* الملف المهني */}
          <h2 className="text-xs font-bold text-secondary border-b border-white/[0.04] pb-2 pt-4 flex items-center gap-2 uppercase tracking-wider">
            <FiBriefcase /> تفاصيل الملف المهني الموثق
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* المسمى الوظيفي */}
            <div className="flex flex-col gap-2 md:col-span-1">
              <label className="text-xs font-bold text-slate-400">
                المسمى الوظيفي
              </label>
              <input
                type="text"
                placeholder="مثال: Frontend Engineer"
                className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none transition-colors text-right"
                {...register("title")}
              />
            </div>

            {/* مستوى الخبرة - مطابق للـ Enum بالباك إند */}
            <div className="flex flex-col gap-2 md:col-span-1">
              <label className="text-xs font-bold text-slate-400">
                مستوى الخبرة
              </label>
              <select
                className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none transition-colors cursor-pointer"
                {...register("experienceLevel")}
              >
                <option value="beginner">مبتدئ (Beginner)</option>
                <option value="intermediate">متوسط (Intermediate)</option>
                <option value="expert">خبير (Expert)</option>
              </select>
            </div>

            {/* سعر الساعة */}
            <div className="flex flex-col gap-2 md:col-span-1">
              <label className="text-xs font-bold text-slate-400">
                سعر الساعة ($)
              </label>
              <input
                type="number"
                className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none transition-colors text-left"
                dir="ltr"
                {...register("hourlyRate")}
              />
            </div>
          </div>

          {/* النبذة التعريفية */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400">
              النبذة التعريفية الفنية (Bio)
            </label>
            <textarea
              rows="4"
              placeholder="اكتب بالتفصيل عن خبراتك والمشاريع البرمجية التي قمت بإنجازها..."
              className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none resize-none leading-relaxed text-right"
              {...register("bio")}
            ></textarea>
          </div>

          {/* المهارات الحركية التفاعلية */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400">
              المهارات والتقنيات (اضغط Enter للإضافة الحية)
            </label>
            <div
              className="bg-slate-950 border border-white/[0.08] focus-within:border-secondary rounded-xl p-3 min-h-[52px] flex flex-wrap gap-2 transition-colors"
              dir="rtl"
            >
              {currentSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-white/[0.02] text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 border border-white/[0.04] group hover:border-red-500/30"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-500 hover:text-red-400 font-bold text-sm transition-colors mr-1"
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
                  currentSkills.length === 0
                    ? "مثال: React, Node.js, Python"
                    : ""
                }
                className="bg-transparent border-none outline-none text-slate-200 text-xs flex-1 min-w-[140px] px-2 text-right"
              />
            </div>
          </div>

          {/* رابط جيت هاب */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <FiGithub size={13} /> رابط حساب GitHub
            </label>
            <input
              type="url"
              placeholder="https://github.com/username"
              className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none text-left"
              dir="ltr"
              {...register("githubLink")}
            />
          </div>

          {/* روابط معرض الأعمال التفاعلي الجديد */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <FiGlobe size={13} /> روابط معرض أعمالك الخارجي (Portfolio Links)
            </label>

            {/* عرض الروابط المضافة كـ كروت مبسطة */}
            <div className="flex flex-col gap-2 mb-1">
              {portfolioLinks.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-950/40 border border-white/[0.04] p-3 rounded-xl text-xs text-slate-300 transition-all hover:border-white/[0.08]"
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary hover:underline truncate max-w-[85%] font-mono"
                    dir="ltr"
                  >
                    {link}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemovePortfolioLink(link)}
                    className="p-1 text-slate-500 hover:text-red-400 rounded-lg hover:bg-white/[0.02] transition-all mr-2"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* حقل إدخال الرابط الجديد مع زرار الإضافة اليساري */}
            <div className="relative flex items-center">
              <input
                type="url"
                value={portfolioInput}
                onChange={(e) => setPortfolioInput(e.target.value)}
                onKeyDown={handleAddPortfolioLink}
                placeholder="أدخل الرابط ثم اضغط Enter أو علامة + المجاورة"
                className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl p-3.5 pl-12 text-xs text-slate-200 focus:outline-none text-left"
                dir="ltr"
              />
              <button
                type="button"
                onClick={handleAddPortfolioLink}
                className="absolute left-3 p-2 bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-secondary rounded-lg transition-colors"
              >
                <FiPlus size={14} />
              </button>
            </div>
          </div>

          {/* السيرة الذاتية - المدخل المباشر لـ عقل الـ AI */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <FiFileText size={13} /> السيرة الذاتية المعتمدة (CV)
            </label>

            {hasCv && (
              <div className="text-green-400 text-[11px] font-bold bg-green-500/5 border border-green-500/10 px-3 py-2 rounded-xl w-fit mb-1 flex items-center gap-1.5">
                ✨ تم فحص وتوثيق السيرة الذاتية بنجاح على سيرفر مسار
              </div>
            )}

            <input
              type="file"
              accept=".pdf"
              className="w-full bg-slate-950 border border-white/[0.08] rounded-xl p-3 text-xs text-slate-400 file:bg-white/[0.03] file:border file:border-white/[0.06] file:text-slate-200 file:rounded-lg file:px-3 file:py-1 file:mr-3 file:cursor-pointer hover:file:bg-white/[0.05] file:transition-colors text-left"
              dir="ltr"
              {...register("cv")}
            />
          </div>

          {/* زر الترحيل والحفظ النهائي */}
          <div className="pt-4 border-t border-white/[0.05]">
            <Button
              type="submit"
              variant="accent"
              className="w-full md:w-auto px-10 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-secondary/10 text-slate-950 hover:scale-[1.02] active:scale-[0.98] transition-all"
              disabled={isPending}
            >
              <FiSave />
              {isPending
                ? "جاري تشغيل الـ AI وتحليل الملف الشخصي..."
                : "تحديث وتوثيق الحساب الفوري ✔️"}
            </Button>
          </div>
        </form>
      </div>

      {/* كومبوننت تغيير الباسورد المستقر */}
      <ChangePassword />
    </div>
  );
}
