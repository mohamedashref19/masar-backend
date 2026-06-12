import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input, Button } from "../../../components";
import { FiPlusCircle, FiFileText } from "react-icons/fi";

const milestoneSchema = z.object({
  title: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
  description: z.string().min(10, "الوصف يجب أن يكون تفصيلياً"),
  amount: z.coerce.number().min(5, "القيمة لا تقل عن 5 دولار"),
  deadline: z.string().min(1, "يرجى تحديد تاريخ التسليم المستهدف"),
});

export default function CreateMilestoneForm({ onAddMilestone, isLoading }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(milestoneSchema),
  });

  const onSubmit = (data) => {
    onAddMilestone(data, { onSuccess: () => reset() });
  };

  return (
    // 🎯 تحديث الحاوية لستايل الـ Cyber Box النظيف المتناسق مع بقية النظام
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-slate-950/40 border border-white/[0.05] p-5 md:p-6 rounded-2xl space-y-5 mb-8 text-right"
      dir="rtl"
    >
      <div className="flex items-center gap-2 border-b border-white/[0.05] pb-3 mb-2">
        <FiPlusCircle className="text-secondary" size={18} />
        <h3 className="text-base font-bold text-white">
          تخطيط مرحلة دفع جديدة (Milestone)
        </h3>
      </div>

      <Input
        label="عنوان المرحلة الفنية"
        id="title"
        placeholder="مثال: تسليم واجهات المستخدم وتجربة الأداء"
        {...register("title")}
        error={errors.title?.message}
        className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl text-slate-200 text-xs md:text-sm"
      />

      <div className="flex flex-col gap-2">
        <label
          htmlFor="description"
          className="text-xs font-bold text-slate-400 flex items-center gap-1"
        >
          <FiFileText size={12} /> تفاصيل وشروط المطلوب تسليمه في هذه المرحلة
        </label>
        <textarea
          id="description"
          rows="3"
          placeholder="اكتب بوضوح الملفات، الأكواد، أو المخرجات المتوقع استلامها..."
          className={`w-full bg-slate-950 border ${errors.description ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-secondary"} rounded-xl p-3 text-slate-200 text-xs md:text-sm focus:outline-none transition-colors resize-none leading-relaxed text-right`}
          {...register("description")}
        />
        {errors.description && (
          <span className="text-[11px] font-medium text-red-400 mt-0.5 block">
            ⚠️ {errors.description.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="المبلغ المخصص للمرحلة ($)"
          id="amount"
          type="number"
          placeholder="مثال: 150"
          {...register("amount")}
          error={errors.amount?.message}
          className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl text-slate-200 text-left font-sans text-xs md:text-sm"
          dir="ltr"
        />

        <Input
          label="الموعد المستهدف للتسليم"
          id="deadline"
          type="date"
          {...register("deadline")}
          error={errors.deadline?.message}
          className="w-full bg-slate-950 border border-white/[0.08] focus:border-secondary rounded-xl text-slate-300 focus:outline-none text-right text-xs md:text-sm"
        />
      </div>

      <Button
        type="submit"
        variant="accent"
        className="w-full py-3 rounded-xl font-bold text-xs md:text-sm text-slate-950 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-secondary/5 transition-all"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-t-transparent border-slate-950 rounded-full animate-spin" />
            <span>جاري حجز وبناء المرحلة المادية...</span>
          </div>
        ) : (
          "تأكيد وإيداع المرحلة في مخطط الدفع"
        )}
      </Button>
    </form>
  );
}
