import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button } from "../../../components";
import { reviewSchema } from "../../../utils/validation";

export default function AddReviewModal({
  isOpen,
  onClose,
  onSubmitReview,
  isPending,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 }, // الافتراضي 5 نجوم
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-primary w-full max-w-md rounded-xl border border-slate-800 shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-heading">تقييم المستقل</h2>
          <p className="text-sm text-slate-400 mt-1">
            رأيك يساعد في بناء مجتمع موثوق
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmitReview)} className="p-6 space-y-5">
          {/* اختيار التقييم (مؤقتاً Select لحد ما نعمل Component للنجوم) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-300">
              التقييم (من 5)
            </label>
            <select
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary"
              {...register("rating")}
            >
              <option value="5">⭐⭐⭐⭐⭐ (5/5) ممتاز</option>
              <option value="4">⭐⭐⭐⭐ (4/5) جيد جداً</option>
              <option value="3">⭐⭐⭐ (3/5) جيد</option>
              <option value="2">⭐⭐ (2/5) مقبول</option>
              <option value="1">⭐ (1/5) ضعيف</option>
            </select>
            {errors.rating && (
              <span className="text-xs text-red-500">
                {errors.rating.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-300">
              التعليق
            </label>
            <textarea
              rows="4"
              placeholder="كيف كانت تجربتك في العمل مع هذا المستقل؟"
              className={`bg-slate-900 border ${
                errors.review ? "border-red-500" : "border-slate-700"
              } rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary transition-all resize-none`}
              {...register("review")}
            ></textarea>
            {errors.review && (
              <span className="text-xs text-red-500">
                {errors.review.message}
              </span>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="accent"
              className="flex-1"
              disabled={isPending}
            >
              {isPending ? "جاري الإرسال..." : "إرسال التقييم"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-white flex-1"
              disabled={isPending}
            >
              تخطي
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
