import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getProjectById } from "../features/projects/services/projectsApi"; // دالة جلب مشروع واحد
import { useUpdateProject } from "../features/projects/hooks/useProjectMutations";
import { Button } from "../components";

// 🎯 اسكيما التعديل (لو عندك واحدة في validation.js استخدمها)
const editProjectSchema = z.object({
  title: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
  description: z.string().min(20, "الوصف يجب أن يكون 20 حرفاً على الأقل"),
  budget: z.coerce.number().min(5, "الميزانية يجب أن تكون 5 دولارات على الأقل"),
});

export default function EditProject() {
  const { id } = useParams(); // هنجيب الـ ID من اللينك
  const navigate = useNavigate();
  const { mutate: updateProjectBtn, isPending: isUpdating } =
    useUpdateProject();

  // 1. جلب بيانات المشروع القديمة
  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id),
  });

  const project = data?.data?.project || data?.project || data?.data;

  // 2. إعداد الفورم
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProjectSchema),
    // 🎯 القيم الافتراضية هتاخد الداتا اللي راجعة من الباك إند
    values: {
      title: project?.title || "",
      description: project?.description || "",
      budget: project?.budget || "",
    },
    // useForm's 'values' prop is perfect here because it reacts to data changes when fetching finishes
  });

  const onSubmit = (formData) => {
    // هنبعت الـ ID والبيانات الجديدة للهوك
    updateProjectBtn({ id, projectData: formData });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="text-center py-20 text-red-400">
        <p>عفواً، لا يمكن العثور على المشروع.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          رجوع
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 mt-16 max-w-3xl animate-fade-in-up">
      <div className="bg-primary border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-800 bg-slate-900/50">
          <h1 className="text-3xl font-bold text-heading">تعديل المشروع</h1>
          <p className="text-slate-400 mt-2">
            قم بتحديث بيانات مشروعك (العروض الحالية لن تتأثر).
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* حقل العنوان */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">
              عنوان المشروع
            </label>
            <input
              type="text"
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary transition-colors"
              {...register("title")}
            />
            {errors.title && (
              <span className="text-xs text-red-500">
                {errors.title.message}
              </span>
            )}
          </div>

          {/* حقل الوصف */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">
              تفاصيل المشروع
            </label>
            <textarea
              rows="6"
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary transition-colors resize-none"
              {...register("description")}
            ></textarea>
            {errors.description && (
              <span className="text-xs text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* حقل الميزانية */}
          <div className="flex flex-col gap-2 w-full md:w-1/2">
            <label className="text-sm font-medium text-slate-300">
              الميزانية المتوقعة ($)
            </label>
            <input
              type="number"
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary transition-colors"
              {...register("budget")}
            />
            {errors.budget && (
              <span className="text-xs text-red-500">
                {errors.budget.message}
              </span>
            )}
          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row gap-4">
            <Button
              type="submit"
              variant="accent"
              className="px-10"
              disabled={isUpdating}
            >
              {isUpdating ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="px-10"
              onClick={() => navigate(-1)} // بيرجع للصفحة اللي قبلها
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
