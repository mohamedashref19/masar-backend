import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button } from "../../../components";
import { applyProposalSchema } from "../../../utils/validation";
import { useApplyProposal } from "../hooks/useApplyProposal";

export default function ApplyProposalModal({ isOpen, onClose, projectId }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(applyProposalSchema),
  });

  const { mutate: applyMutate, isPending } = useApplyProposal(() => {
    reset(); // تفريغ الفورم بعد النجاح
    onClose(); // قفل المودال
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    applyMutate({ projectId, proposalData: data });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-primary w-full max-w-lg rounded-xl border border-slate-800 shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-heading">
            تقديم عرض على المشروع
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-300">
              تفاصيل العرض (Cover Letter)
            </label>
            <textarea
              rows="5"
              placeholder="وضح لماذا أنت الأنسب لهذا المشروع، وكيف ستقوم بتنفيذه..."
              className={`bg-slate-900 border ${
                errors.coverLetter ? "border-red-500" : "border-slate-700"
              } rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all resize-none`}
              {...register("coverLetter")}
            ></textarea>
            {errors.coverLetter && (
              <span className="text-xs text-red-500">
                {errors.coverLetter.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="السعر (بالدولار)"
              type="number"
              placeholder="مثال: 100"
              {...register("price")}
              error={errors.price?.message}
            />
            <Input
              label="مدة التنفيذ (بالأيام)"
              type="number"
              placeholder="مثال: 7"
              {...register("duration")}
              error={errors.duration?.message}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-800 mt-6">
            <Button
              type="submit"
              variant="accent"
              className="flex-1"
              disabled={isPending}
            >
              {isPending ? "جاري الإرسال..." : "إرسال العرض"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-white flex-1"
              disabled={isPending}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
