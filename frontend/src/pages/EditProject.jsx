import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getProjectById } from "../features/projects/services/projectsApi";
import { useUpdateProject } from "../features/projects/hooks/useProjectMutations";
import { Button } from "../components";
import { FiEdit3, FiArrowRight, FiCheckCircle } from "react-icons/fi";

// 🎯 اسكيما التعديل المحكمة
const editProjectSchema = z.object({
  title: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
  description: z.string().min(20, "الوصف يجب أن يكون 20 حرفاً على الأقل"),
  budget: z.coerce.number().min(5, "الميزانية يجب أن تكون 5 دولارات على الأقل"),
});

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutate: updateProjectBtn, isPending: isUpdating } =
    useUpdateProject();

  // 1. جلب بيانات المشروع القديمة
  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id),
  });

  const project = data?.data?.project || data?.project || data?.data;

  // 2. إعداد الفورم ومزامنة القيم تلقائياً
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProjectSchema),
    values: {
      title: project?.title || "",
      description: project?.description || "",
      budget: project?.budget || "",
    },
  });

  const onSubmit = (formData) => {
    updateProjectBtn({ id, projectData: formData });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#080B10] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
        <span className="text-xs text-slate-500 font-medium">
          جاري سحب مستندات المشروع الفنية...
        </span>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div
        dir="rtl"
        className="flex flex-col justify-center items-center min-h-screen bg-[#080B10] text-center p-4"
      >
        <span className="text-4xl mb-4">🔍</span>
        <p className="text-red-400 font-bold text-sm">
          عفواً، لم نتمكن من العثور على وثائق هذا المشروع في قاعدة البيانات.
        </p>
        <Button
          variant="outline"
          className="mt-6 border-white/5 text-slate-300 hover:bg-white/5"
          onClick={() => navigate(-1)}
        >
          ← العودة للخلف
        </Button>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="container mx-auto py-12 px-4 mt-20 max-w-3xl text-right relative selection:bg-secondary/30"
    >
      {/* هالة إضاءة خلفية ناعمة */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-secondary/[0.03] blur-[100px] pointer-events-none" />

      <div className="bg-[#0D121A] border border-white/[0.05] rounded-2xl shadow-2xl overflow-hidden relative">
        {/* هيدر كارت التعديل */}
        <div className="p-6 md:p-8 border-b border-white/[0.05] bg-gradient-to-r from-white/[0.01] to-transparent flex items-center gap-3">
          <div className="p-3 bg-secondary/10 border border-secondary/20 text-secondary rounded-xl text-xl">
            <FiEdit3 />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">
              تعديل بيانات المشروع
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              قم بتحديث صياغة بنود مشروعك (العروض والتعاقدات القائمة لن تتأثر
              كلياً).
            </p>
          </div>
        </div>

        {/* نموذج البيانات الفني */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 md:p-8 space-y-6 text-sm"
        >
          {/* 1. حقل العنوان */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400">
              عنوان المشروع المهني
            </label>
            <input
              type="text"
              autoComplete="off"
              className={`w-full bg-slate-950 border ${errors.title ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-secondary"} rounded-xl p-3 text-slate-200 focus:outline-none transition-colors text-right`}
              {...register("title")}
            />
            {errors.title && (
              <span className="text-[11px] font-medium text-red-400 mt-0.5 block">
                ⚠️ {errors.title.message}
              </span>
            )}
          </div>

          {/* 2. حقل الوصف */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400">
              تفاصيل ومواصفات المشروع الفنية
            </label>
            <textarea
              rows="6"
              className={`w-full bg-slate-950 border ${errors.description ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-secondary"} rounded-xl p-3 text-slate-200 focus:outline-none transition-colors resize-none leading-relaxed text-right`}
              {...register("description")}
            ></textarea>
            {errors.description && (
              <span className="text-[11px] font-medium text-red-400 mt-0.5 block">
                ⚠️ {errors.description.message}
              </span>
            )}
          </div>

          {/* 3. حقل الميزانية */}
          <div className="flex flex-col gap-2 w-full md:w-1/2">
            <label className="text-xs font-bold text-slate-400">
              الميزانية التقديرية المقترحة ($)
            </label>
            <input
              type="number"
              className={`w-full bg-slate-950 border ${errors.budget ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-secondary"} rounded-xl p-3 text-slate-200 focus:outline-none transition-colors text-right`}
              {...register("budget")}
            />
            {errors.budget && (
              <span className="text-[11px] font-medium text-red-400 mt-0.5 block">
                ⚠️ {errors.budget.message}
              </span>
            )}
          </div>

          {/* 4. أزرار الاعتماد والإلغاء المحدثة */}
          <div className="pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row gap-4 justify-start">
            <Button
              type="submit"
              variant="accent"
              className="px-8 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_10px_25px_rgba(228,255,0,0.1)] hover:shadow-[0_10px_25px_rgba(228,255,0,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-slate-950"
              disabled={isUpdating}
            >
              <FiCheckCircle size={15} />{" "}
              {isUpdating
                ? "جاري حفظ التعديلات السيرفر..."
                : "تحديث وحفظ البنود الحية"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="px-8 py-3 rounded-xl font-semibold text-xs border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.04] text-slate-300 transition-colors flex items-center justify-center gap-1.5 group"
              onClick={() => navigate(-1)}
            >
              إلغاء التعديل{" "}
              <span className="group-hover:translate-x-0.5 transition-transform">
                <FiArrowRight />
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
