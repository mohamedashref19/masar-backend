import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom"; // 🔥 لاستخدام التوجيه المباشر للإعدادات
import Swal from "sweetalert2"; // 🎯 لتقديم تنبيه أمني فخم للجنة
import { Input, Button } from "../../../components";
import { applyProposalSchema } from "../../../utils/validation";
import { useApplyProposal } from "../hooks/useApplyProposal";
import {
  FiFileText,
  FiDollarSign,
  FiClock,
  FiX,
  FiAlertTriangle,
  FiSend,
} from "react-icons/fi";

export default function ApplyProposalModal({ isOpen, onClose, projectId }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(applyProposalSchema),
  });

  // 🎯 استبدل سطر الـ useApplyProposal القديم بالتقفيل المأمن ده:
  const { mutate: applyMutate, isPending } = useApplyProposal({
    onSuccess: () => {
      reset();
      onClose();
      Swal.fire({
        title: "تم إيداع عرضك الفني! 🚀",
        text: "تم تسجيل مقترحك بنجاح في كراسة عروض المشروع.",
        icon: "success",
        background: "#0D121A",
        color: "#fff",
        confirmButtonColor: "#22c55e",
      });
    },
    onError: (err) => {
      // 🚀 لقطة الأبعاد الأمنية من الـ Network Payload الحقيقي بتاعك
      const statusCode =
        err?.response?.data?.error?.statusCode ||
        err?.response?.status ||
        err?.status;

      // سحب الرسالة الإنجليزية "You can't send proposals..." اللي بتطلعلك حالاً
      const serverMessage = err?.response?.data?.message || err?.message;

      onClose(); // نقفل المودال فوراً عشان الـ Swal يبان في نص الشاشة لوحده بشياكة

      if (statusCode === 403) {
        Swal.fire({
          title: "قيد فني وأمني ⚠️",
          // ترجمة فورية فخمة للرسالة مع الحفاظ على فحواها للجنة غداً
          text: "حسابك مقيد من التقديم بقرار من الـ AI: يجب استكمال بياناتك أولاً (الـ CV، المهارات، وروابط الأعمال) لتجاوز الفحص البرمي بنجاح.",
          icon: "error",
          background: "#0D121A",
          color: "#f3f4f6",
          showCancelButton: true,
          confirmButtonColor: "#E4FF00", // لون براند مسار النيون
          cancelButtonColor: "#111827",
          confirmButtonText:
            "<span style='color: #080B10; font-weight: bold;'>تعديل بيانات الحساب ⚙️</span>",
          cancelButtonText: "إغلاق التنبيه",
          customClass: {
            popup: "border border-white/[0.05] rounded-2xl font-sans",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/freelancer-settings"); // طيران على صفحة تعديل الداتا
          }
        });
      } else {
        // الأخطاء العادية الأخرى
        Swal.fire({
          title: "فشل الإجراء ⚠️",
          text: serverMessage || "حدث خطأ غير متوقع أثناء تقديم العرض.",
          icon: "error",
          background: "#0D121A",
          color: "#f3f4f6",
          confirmButtonColor: "#334155",
          confirmButtonText: "حسناً",
        });
      }
    },
  });
  if (!isOpen) return null;

  const onSubmit = (data) => {
    applyMutate({ projectId, proposalData: data });
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 text-right animate-in fade-in duration-200"
    >
      {/* جسم المودال السيبراني الفخم */}
      <div className="bg-[#0D121A] w-full max-w-lg rounded-2xl border border-white/[0.06] shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden animate-in zoom-in-95 duration-200 relative">
        {/* خط إضاءة نيون علوي ناعم */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/[0.04] bg-slate-950/20">
          <div>
            <h2 className="text-base md:text-lg font-black text-white tracking-tight">
              تقديم عرض هندسي على المشروع
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5 font-light">
              اطرح تسعيرك وجدولك الزمني بدقة لاقتناص التعاقد المأمن.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all outline-none"
            disabled={isPending}
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-5 text-xs md:text-sm"
        >
          {/* تفاصيل العرض (Cover Letter) */}
          <div className="flex flex-col gap-2 relative group">
            <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5 transition-colors group-focus-within:text-secondary">
              <FiFileText size={13} /> تفاصيل ومقترح العرض فني (Cover Letter)
            </label>
            <textarea
              rows="5"
              placeholder="وضح للعميل أدواتك التقنية، خطتك لتنفيذ المخرجات، ولماذا أنت الأنسب للهندسة البرمجية لهذا العقد..."
              className={`w-full bg-slate-950 border ${
                errors.coverLetter
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-white/[0.06] focus:border-secondary"
              } rounded-xl p-3.5 text-slate-200 focus:outline-none transition-all duration-300 resize-none leading-relaxed text-right`}
              {...register("coverLetter")}
            />
            {errors.coverLetter && (
              <span className="text-[11px] font-medium text-red-400 mt-0.5 block">
                ⚠️ {errors.coverLetter.message}
              </span>
            )}
          </div>

          {/* السعر والمدة كـ Grid مضبوط */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label="قيمة العرض المالي ($)"
                id="price"
                type="number"
                placeholder="مثال: 500"
                {...register("price")}
                error={errors.price?.message}
                className="w-full bg-slate-950 border border-white/[0.06] focus:border-secondary rounded-xl text-slate-200 text-left font-sans py-3.5 transition-all"
                dir="ltr"
              />
            </div>

            <div className="relative">
              <Input
                label="مدة التنفيذ المتوقعة (بالأيام)"
                id="duration"
                type="number"
                placeholder="مثال: 10"
                {...register("duration")}
                error={errors.duration?.message}
                className="w-full bg-slate-950 border border-white/[0.06] focus:border-secondary rounded-xl text-slate-200 text-left font-sans py-3.5 transition-all"
                dir="ltr"
              />
            </div>
          </div>

          {/* الأزرار وسير معالجة البيانات السفلي */}
          <div className="flex gap-3 pt-4 border-t border-white/[0.04] mt-6">
            <Button
              type="submit"
              variant="accent"
              className="flex-1 py-3.5 rounded-xl font-bold text-xs md:text-sm text-slate-950 flex items-center justify-center gap-1.5 shadow-lg shadow-secondary/5 hover:scale-[1.01] active:scale-[0.99] transition-all"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-4 h-4 border-2 border-t-transparent border-slate-950 rounded-full animate-spin" />
                  <span>جاري فحص وتشفير بنود المقترح...</span>
                </div>
              ) : (
                <>
                  <FiSend />
                  <span>إرسال وإيداع العقد الآن</span>
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] text-slate-300 px-6 rounded-xl text-xs font-bold transition-all"
              disabled={isPending}
            >
              إلغاء التقديم
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
