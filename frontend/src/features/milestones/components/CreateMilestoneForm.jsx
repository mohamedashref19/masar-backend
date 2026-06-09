import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input, Button } from "../../../components";

const milestoneSchema = z.object({
  title: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
  description: z.string().min(10, "الوصف يجب أن يكون تفصيلياً"),
  amount: z.coerce.number().min(5, "القيمة لا تقل عن 5 دولار"),
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl space-y-4 mb-8"
    >
      <h3 className="text-lg font-bold text-heading mb-2">
        إضافة مرحلة دفع جديدة (Milestone)
      </h3>

      <Input
        label="عنوان المرحلة"
        id="title"
        placeholder="مثال: تسليم الواجهات وتجربة المستخدم"
        {...register("title")}
        error={errors.title?.message}
      />

      <div className="flex flex-col gap-1">
        <label
          htmlFor="description"
          className="text-sm font-medium text-slate-300"
        >
          تفاصيل المطلوب في هذه المرحلة
        </label>
        <textarea
          id="description"
          rows="3"
          placeholder="اكتب الشروط والملفات المطلوب تسليمها..."
          className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:outline-none focus:border-secondary"
          {...register("description")}
        ></textarea>
        {errors.description && (
          <span className="text-xs text-red-500">
            {errors.description.message}
          </span>
        )}
      </div>

      <Input
        label="المبلغ المخصص للمرحلة ($)"
        id="amount"
        type="number"
        placeholder="مثال: 150"
        {...register("amount")}
        error={errors.amount?.message}
      />

      <Input
        label="الموعد المستهدف لتسليم هذه المرحلة"
        id="deadline"
        type="date"
        {...register("deadline")}
        error={errors.deadline?.message}
      />

      <Button
        type="submit"
        variant="accent"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "جاري إنشاء المرحلة..." : "تأكيد وإنشاء المرحلة"}
      </Button>
    </form>
  );
}
