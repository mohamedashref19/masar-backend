import { useState } from "react";
import Swal from "sweetalert2";
import { useProjectLifecycle } from "../hooks/useProjectLifecycle";
import AddReviewModal from "../../reviews/components/AddReviewModal";
import { Button } from "../../../components";
import { FiCheckCircle, FiXCircle, FiAlertTriangle } from "react-icons/fi";

export default function ProjectActionsForClient({ project }) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { completeMutation, cancelMutation, reviewMutation } =
    useProjectLifecycle();

  // تأمين صياغة حالة المشروع المرنة
  const projectStatus =
    project?.status?.toLowerCase() ||
    project?.project?.status?.toLowerCase() ||
    "";
  const isInProgress =
    projectStatus === "in-progress" || projectStatus === "in_progress";
  const targetProjectId = project?._id || project?.project?._id;

  const handleComplete = () => {
    // 1. إنهاء وإغلاق المشروع برمجياً على السيرفر
    completeMutation.mutate(targetProjectId, {
      onSuccess: () => {
        // 2. المحافظة الحركية لايف: فتح المودال فوراً بعد نجاح العملية
        setIsReviewModalOpen(true);
      },
      onError: (err) => {
        Swal.fire({
          title: "فشل الإجراء",
          text: err?.message || "حدث خطأ غير متوقع أثناء معالجة إنهاء المشروع.",
          icon: "error",
          background: "#0D121A",
          color: "#fff",
          confirmButtonColor: "#334155",
        });
      },
    });
  };

  const handleCancel = async () => {
    // 🎯 تحديث الـ SweetAlert2 لليفل الـ Premium Cyber Design
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "أنت بصدد إلغاء هذا المشروع التأميني، هذا الإجراء برمي صارم ولا يمكن التراجع عنه مطلقاً!",
      icon: "className",
      iconHtml: `<span class="text-red-400 text-4xl">⚠️</span>`,
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#111827",
      confirmButtonText: "نعم، إلغاء الحجز والتعاقد",
      cancelButtonText: "تراجع ومتابعة",
      background: "#0D121A",
      color: "#f3f4f6",
      customClass: {
        popup: "border border-white/[0.08] rounded-2xl font-sans",
      },
    });

    if (result.isConfirmed) {
      cancelMutation.mutate(targetProjectId, {
        onSuccess: () => {
          Swal.fire({
            title: "تم سحب التعاقد!",
            text: "تم إلغاء المشروع وتحديث الـ Ledger بنجاح.",
            icon: "success",
            background: "#0D121A",
            color: "#fff",
            confirmButtonColor: "#22c55e",
            customClass: {
              popup: "border border-white/[0.08] rounded-2xl",
            },
          });
        },
      });
    }
  };

  const handleReviewSubmit = (data) => {
    // 🎯 تأمين استخراج المعرف الفريد (ID) الخاص بالمستقل لضمان سلامة الـ Relational Integrity
    const currentProjectData = project?.project || project;
    const freelancerId =
      typeof currentProjectData.assignedFreelancer === "object"
        ? currentProjectData.assignedFreelancer?._id
        : currentProjectData.assignedFreelancer;

    reviewMutation.mutate(
      {
        project: targetProjectId,
        freelancer: freelancerId,
        rating: data.rating,
        comment: data.comment || data.review,
      },
      {
        onSuccess: () => {
          setIsReviewModalOpen(false);
          Swal.fire({
            title: "تم التوثيق! ⭐",
            text: "تم إيداع تقييمك المهني للمستقل في سجل المنصة بنجاح.",
            icon: "success",
            background: "#0D121A",
            color: "#fff",
            timer: 2500,
            showConfirmButton: false,
            customClass: {
              popup: "border border-white/[0.08] rounded-2xl",
            },
          });
        },
      },
    );
  };

  // حارس البوابة المطور: لو المشروع مش نشط والمودال مقفول، احجب الأكشنز فوراً لمنع الـ Layout Pollution
  if (!isInProgress && !isReviewModalOpen) {
    return null;
  }

  return (
    <div dir="rtl" className="text-right">
      {/* الأزرار الحركية للمشغل (Client Actions Bento Card) */}
      {isInProgress && (
        <div className="flex flex-col sm:flex-row gap-4 mt-6 p-4 bg-slate-950/40 border border-white/[0.05] rounded-xl items-center justify-between">
          <div className="text-right">
            <h4 className="text-xs font-bold text-slate-300">
              إدارة دورة حياة التعاقد
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 font-light">
              يمكنك إنهاء المشروع لصرف مستحقات الضمان أو إلغاء العقد بالكامل.
            </p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="accent"
              className="flex-1 sm:flex-none py-2.5 px-6 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-secondary/5 text-slate-950"
              onClick={handleComplete}
              disabled={completeMutation.isPending}
            >
              {completeMutation.isPending ? (
                <span className="w-4 h-4 border-2 border-t-transparent border-slate-950 rounded-full animate-spin" />
              ) : (
                <>
                  <FiCheckCircle />
                  <span>إنهاء المشروع وإغلاقه</span>
                </>
              )}
            </Button>

            <Button
              className="flex-1 sm:flex-none bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 hover:border-red-500/20 py-2.5 px-6 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? (
                <span className="w-4 h-4 border-2 border-t-transparent border-red-400 rounded-full animate-spin" />
              ) : (
                <>
                  <FiXCircle />
                  <span>إلغاء المشروع</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* الـ Modal المعلق بالـ State دائم التواجد لمنع الاختفاء الفجائي */}
      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmitReview={handleReviewSubmit}
        isPending={reviewMutation.isPending}
      />
    </div>
  );
}
