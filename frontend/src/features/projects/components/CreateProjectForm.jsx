import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button } from "../../../components"; // افترضت إنك عامل فولدر للـ UI
import { createProjectSchema } from "../../../utils/validation";

export default function CreateProjectForm({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createProjectSchema),
  });

  return (
    <div className="w-full max-w-2xl mx-auto bg-primary p-8 rounded-xl border border-slate-800 shadow-2xl">
      <div className="mb-8 border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-heading">إضافة مشروع جديد</h2>
        <p className="text-body mt-2 text-sm">
          أضف تفاصيل مشروعك بدقة لجذب أفضل المستقلين
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* عنوان المشروع */}
        <Input
          label="عنوان المشروع"
          id="title"
          placeholder="مثال: تصميم موقع تعريفي لشركة عقارات"
          {...register("title")}
          error={errors.title?.message}
        />

        {/* وصف المشروع (استخدمنا textarea مباشرة مع ستايل متناسق) */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-300"
          >
            وصف المشروع
          </label>
          <textarea
            id="description"
            rows="5"
            placeholder="اكتب تفاصيل المشروع، المهام المطلوبة، وأي شروط خاصة..."
            className={`bg-slate-900 border ${
              errors.description ? "border-red-500" : "border-slate-700"
            } rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all resize-none`}
            {...register("description")}
          ></textarea>
          {errors.description && (
            <span className="text-xs text-red-500">
              {errors.description.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* القسم */}
          <Input
            label="القسم (Category)"
            id="category"
            placeholder="مثال: تطوير ويب، تصميم جرافيك..."
            {...register("category")}
            error={errors.category?.message}
          />

          {/* الميزانية */}
          <Input
            label="الميزانية المتوقعة (بالدولار)"
            id="budget"
            type="number"
            placeholder="مثال: 150"
            {...register("budget")}
            error={errors.budget?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* المهارات المطلوبة */}
          <Input
            label="المهارات المطلوبة (افصل بينها بفاصلة)"
            id="skillsRequired"
            placeholder="مثال: React, Node.js, MongoDB"
            {...register("skillsRequired")}
            error={errors.skillsRequired?.message}
          />

          {/* الموعد النهائي */}
          <Input
            label="الموعد النهائي لتسليم المشروع"
            id="deadline"
            type="date"
            {...register("deadline")}
            error={errors.deadline?.message}
          />
        </div>

        {/* زر الإرسال */}
        <Button
          type="submit"
          variant="accent"
          className="w-full mt-8"
          disabled={isLoading}
        >
          {isLoading ? "جاري نشر المشروع..." : "نشر المشروع الآن"}
        </Button>
      </form>
    </div>
  );
}
