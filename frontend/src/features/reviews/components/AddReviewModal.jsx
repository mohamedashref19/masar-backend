import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button } from "../../../components";
import { reviewSchema } from "../../../utils/validation";
import { FiStar, FiMessageSquare, FiX } from "react-icons/fi";

export default function AddReviewModal({
  isOpen,
  onClose,
  onSubmitReview,
  isPending,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, review: "" },
  });

  // مراقبة قيمة حقل التقييم لايف من الـ form state
  const currentRating = watch("rating");
  const [hoverRating, setHoverRating] = useState(0);

  // إعادة تهيئة الحقول أول ما يفتح المودال لضمان نظافة البيانات
  useEffect(() => {
    if (isOpen) {
      reset({ rating: 5, review: "" });
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 text-right animate-in fade-in duration-200"
    >
      {/* جسم المودال الزجاجي الفخم */}
      <div className="bg-[#0D121A] w-full max-w-md rounded-2xl border border-white/[0.06] shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden animate-in zoom-in-95 duration-200 relative">
        {/* خط الإضاءة العلوي لجمال الكارد */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/25 to-transparent" />

        {/* زر إغلاق علوي سريع */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          disabled={isPending}
        >
          <FiX size={16} />
        </button>

        {/* هيدر المودال */}
        <div className="p-6 border-b border-white/[0.04] bg-slate-950/20">
          <h2 className="text-lg font-black text-white tracking-tight">
            تقييم الأداء والمستقل
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-light">
            رأيك المهني يساعد في توثيق وبناء مجتمع تقني مأمن وموثوق.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmitReview)}
          className="p-6 space-y-5 text-xs md:text-sm"
        >
          {/* 🌟 1. نظام النجوم التفاعلي الفخم بالكامل - هيبهر اللجنة بكرة */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400">
              تقييم جودة مخرجات العمل (من 5 نجوم)
            </label>

            <div
              className="flex items-center gap-2 py-2 bg-slate-950/40 border border-white/[0.03] rounded-xl justify-center"
              dir="ltr"
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoverRating || currentRating);
                return (
                  <button
                    key={star}
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      setValue("rating", star, { shouldValidate: true })
                    }
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-all transform hover:scale-125 active:scale-95 text-xl md:text-2xl outline-none"
                  >
                    <FiStar
                      className={`transition-colors ${
                        isFilled
                          ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.2)]"
                          : "text-slate-600"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {errors.rating && (
              <span className="text-[11px] font-medium text-red-400 mt-0.5 block">
                ⚠️ {errors.rating.message}
              </span>
            )}
          </div>

          {/* حقل مربع النص والتعليق */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="review"
              className="text-xs font-bold text-slate-400 flex items-center gap-1"
            >
              <FiMessageSquare size={12} /> اكتب تجربتك بالتفصيل
            </label>
            <textarea
              id="review"
              rows="4"
              placeholder="كيف كانت جودة الأكواد والتزام المستقل بالموعد المحدد؟"
              className={`w-full bg-slate-950 border ${errors.review ? "border-red-500/50 focus:border-red-500" : "border-white/[0.08] focus:border-secondary"} rounded-xl p-3.5 text-slate-200 text-xs md:text-sm focus:outline-none transition-all resize-none leading-relaxed text-right`}
              {...register("review")}
            />
            {errors.review && (
              <span className="text-[11px] font-medium text-red-400 mt-0.5 block">
                ⚠️ {errors.review.message}
              </span>
            )}
          </div>

          {/* أزرار التحكم السفلية المنسقة */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="accent"
              className="flex-1 py-3 rounded-xl font-bold text-xs shadow-lg shadow-secondary/5 text-slate-950 hover:scale-[1.02] active:scale-[0.98] transition-all"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-t-transparent border-slate-950 rounded-full animate-spin" />
                  <span>جاري قيد التقييم...</span>
                </div>
              ) : (
                "إرسال وتوثيق التقييم"
              )}
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] text-slate-300 flex-1 py-3 rounded-xl text-xs font-bold transition-all"
              disabled={isPending}
            >
              تخطي وصرف العقد
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
