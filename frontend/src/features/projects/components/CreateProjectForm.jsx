import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button } from "../../../components";
import { createProjectSchema } from "../../../utils/validation";
import {
  FiFileText,
  FiCpu,
  FiPlus,
  FiGrid,
  FiDollarSign,
  FiCalendar,
  FiTag,
  FiBriefcase,
} from "react-icons/fi";

// داخل ملف CreateProjectForm.jsx في البداية:

export default function CreateProjectForm({
  onSubmit,
  isLoading,
  prefilledData,
}) {
  const {
    register,
    handleSubmit,
    reset, // 🎯 استخرجنا دالة الـ reset
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createProjectSchema),
    // الافتراضي الافتراضي
    defaultValues: {
      title: "",
      description: "",
      category: "",
      budget: "",
      deadline: "",
      skillsRequired: "",
      complexity: "Medium",
      experience_required: "Intermediate",
    },
  });

  // 🚀 تريكة الأمان: لو مبعوت داتا مستخرجة من الـ AI، احقنها في الفورم فوراً غصب عن المكون
  useEffect(() => {
    if (prefilledData) {
      reset(prefilledData);
    }
  }, [prefilledData, reset]);
  return (
    <div
      dir="rtl"
      className="w-full text-right font-['Outfit'] selection:bg-secondary/30"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 text-xs md:text-sm"
      >
        {/* ================= القسم الأول: تفاصيل العقد الأساسية ================= */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2">
            <FiBriefcase className="text-secondary text-sm" />
            <h3 className="text-xs font-bold text-slate-400 tracking-wide uppercase">
              المعلومات الأساسية للمشروع
            </h3>
          </div>

          {/* عنوان المشروع */}
          <div className="relative group">
            <Input
              label="عنوان المشروع الفني"
              id="title"
              placeholder="مثال: تصميم وتطوير متجر إلكتروني متكامل"
              {...register("title")}
              error={errors.title?.message}
              className="w-full bg-slate-950/60 border border-white/[0.06] focus:border-secondary rounded-xl text-slate-200 py-3.5 transition-all duration-300"
            />
          </div>

          {/* وصف المشروع المصقول سيبرانياً */}
          <div className="flex flex-col gap-2 relative group">
            <label
              htmlFor="description"
              className="text-xs font-bold text-slate-400 flex items-center gap-1.5 transition-colors group-focus-within:text-secondary"
            >
              <FiFileText size={13} /> كراسة الشروط والوصف المتوقع للمشروع
            </label>
            <textarea
              id="description"
              rows="5"
              placeholder="اكتب بالتفصيل أهداف المشروع، المخرجات المطلوبة، وأي حزم برمجية تفرضها شروط العمل..."
              className={`w-full bg-slate-950/60 border ${
                errors.description
                  ? "border-red-500/40 focus:border-red-500"
                  : "border-white/[0.06] focus:border-secondary"
              } rounded-xl p-3.5 text-slate-200 focus:outline-none transition-all duration-300 resize-none leading-relaxed text-right text-xs md:text-sm shadow-inner`}
              {...register("description")}
            />
            {errors.description && (
              <span className="text-[11px] font-medium text-red-400 mt-0.5 block">
                ⚠️ {errors.description.message}
              </span>
            )}
          </div>
        </div>

        {/* ================= القسم الثاني: الميزانية والتصنيف ================= */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2">
            <FiDollarSign className="text-secondary text-sm" />
            <h3 className="text-xs font-bold text-slate-400 tracking-wide uppercase">
              المحددات المادية والتصنيف
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* القسم */}
            <div className="relative">
              <Input
                label="القسم التقني (Category)"
                id="category"
                placeholder="مثال: Web Development"
                {...register("category")}
                error={errors.category?.message}
                className="w-full bg-slate-950/60 border border-white/[0.06] focus:border-secondary rounded-xl text-slate-200 py-3.5 transition-all duration-300"
              />
            </div>

            {/* الميزانية المقترحة */}
            <div className="relative">
              <Input
                label="الميزانية المقترحة ($)"
                id="budget"
                type="number"
                placeholder="مثال: 1500"
                {...register("budget")}
                error={errors.budget?.message}
                className="w-full bg-slate-950/60 border border-white/[0.06] focus:border-secondary rounded-xl text-slate-200 text-left font-sans py-3.5 transition-all duration-300"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* ================= القسم الثالث: المعايير والمواعيد ================= */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2">
            <FiTag className="text-secondary text-sm" />
            <h3 className="text-xs font-bold text-slate-400 tracking-wide uppercase">
              الشروط الفنية والجدولة الزمنية
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* المهارات المطلوبة */}
            <div className="relative">
              <Input
                label="المهارات المطلوبة (افصل بينها بفاصلة)"
                id="skillsRequired"
                placeholder="مثال: React, Node.js, TypeScript"
                {...register("skillsRequired")}
                error={errors.skillsRequired?.message}
                className="w-full bg-slate-950/60 border border-white/[0.06] focus:border-secondary rounded-xl text-slate-200 py-3.5 transition-all duration-300"
              />
            </div>

            {/* الموعد النهائي */}
            <div className="relative">
              <Input
                label="الموعد النهائي لتسليم المشروع"
                id="deadline"
                type="date"
                {...register("deadline")}
                error={errors.deadline?.message}
                className="w-full bg-slate-950/60 border border-white/[0.06] focus:border-secondary rounded-xl text-slate-300 focus:outline-none py-3.5 transition-all duration-300"
              />
            </div>
          </div>

          {/* فحص مستويات العمل المطابق للـ Enums بالباك إند */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            {/* مستوى التعقيد */}
            <div className="flex flex-col gap-2 group">
              <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5 transition-colors group-focus-within:text-secondary">
                <FiGrid size={13} /> مستوى تعقيد المشروع المقترح
              </label>
              <div className="relative">
                <select
                  {...register("complexity")}
                  className="w-full bg-slate-950/60 border border-white/[0.06] focus:border-secondary rounded-xl p-3.5 text-xs text-slate-300 focus:outline-none transition-all duration-300 cursor-pointer appearance-none shadow-inner"
                >
                  <option value="Flexible">مرن / بسيط (Flexible)</option>
                  <option value="Medium">متوسط التعقيد (Medium)</option>
                  <option value="High">متقدم / معقد جداً (High)</option>
                </select>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
                  ▼
                </span>
              </div>
            </div>

            {/* الخبرة المطلوبة */}
            <div className="flex flex-col gap-2 group">
              <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5 transition-colors group-focus-within:text-secondary">
                <FiCpu size={13} /> الخبرة المطلوبة من المستقل التقني
              </label>
              <div className="relative">
                <select
                  {...register("experience_required")}
                  className="w-full bg-slate-950/60 border border-white/[0.06] focus:border-secondary rounded-xl p-3.5 text-xs text-slate-300 focus:outline-none transition-all duration-300 cursor-pointer appearance-none shadow-inner"
                >
                  <option value="Beginner">
                    مبتدئ (Beginner / Entry Level)
                  </option>
                  <option value="Intermediate">
                    متوسط الخبرة (Intermediate)
                  </option>
                  <option value="Expert">خبير محترف (Expert Level)</option>
                </select>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
                  ▼
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* زر النشر النهائي المصقول تكنولوجياً */}
        <div className="pt-4 border-t border-white/[0.04] mt-8">
          <Button
            type="submit"
            variant="accent"
            className="w-full py-4 rounded-xl font-bold text-xs md:text-sm text-slate-950 flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(228,255,0,0.1)] hover:shadow-[0_10px_35px_rgba(228,255,0,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-t-transparent border-slate-950 rounded-full animate-spin" />
                <span className="tracking-wide">
                  جاري ترحيل وتوثيق كراسة الشروط الرقمية...
                </span>
              </div>
            ) : (
              <>
                <FiPlus className="stroke-[3]" />
                <span className="tracking-wide">نشر المشروع</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
