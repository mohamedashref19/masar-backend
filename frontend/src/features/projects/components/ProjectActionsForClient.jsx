// جوه Component تفاصيل المشروع بتاعك (أو الكارت اللي العميل بيشوفه)
import { useState } from "react";
import Swal from "sweetalert2";
import { useProjectLifecycle } from "../hooks/useProjectLifecycle";
import AddReviewModal from "../../reviews/components/AddReviewModal";

import { Button } from "../../../components";

export default function ProjectActionsForClient({ project }) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { completeMutation, cancelMutation, reviewMutation } =
    useProjectLifecycle();

  const handleComplete = () => {
    // 1. ننهي المشروع
    completeMutation.mutate(project._id, {
      onSuccess: () => {
        // 2. أول ما ينجح، نفتح مودال التقييم
        setIsReviewModalOpen(true);
      },
      onError: () => {
        Swal.fire("خطأ", "حدث خطأ أثناء إنهاء المشروع", "error");
      },
    });
  };

  const handleCancel = async () => {
    // 🎯 استخدام SweetAlert بدل window.confirm
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "إلغاء المشروع لا يمكن التراجع عنه!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", // لون أحمر متوافق مع Tailwind
      cancelButtonColor: "#334155", // لون رمادي غامق دارك مود
      confirmButtonText: "نعم، قم بالإلغاء",
      cancelButtonText: "تراجع",
      background: "#1e293b", // خلفية دارك للـ Alert
      color: "#fff", // نص أبيض
    });

    if (result.isConfirmed) {
      cancelMutation.mutate(project._id, {
        onSuccess: () => {
          Swal.fire({
            title: "تم الإلغاء!",
            text: "تم إلغاء المشروع بنجاح.",
            icon: "success",
            background: "#1e293b",
            color: "#fff",
          });
        },
      });
    }
  };

  const handleReviewSubmit = (data) => {
    // 🎯 تأمين الـ ID بتاع المستقل
    const freelancerId =
      typeof project.assignedFreelancer === "object"
        ? project.assignedFreelancer._id
        : project.assignedFreelancer;

    reviewMutation.mutate(
      {
        project: project._id,
        freelancer: freelancerId,
        rating: data.rating,
        comment: data.review,
      },
      {
        onSuccess: () => {
          setIsReviewModalOpen(false);
          Swal.fire({
            title: "شكراً لك!",
            text: "تم إضافة تقييمك للمستقل بنجاح.",
            icon: "success",
            background: "#1e293b",
            color: "#fff",
            timer: 2000,
            showConfirmButton: false,
          });
        },
      },
    );
  };

  if (project.status !== "in-progress" && !isReviewModalOpen) {
    return null;
  }

  return (
    <>
      {/* الزراير تظهر فقط لو المشروع لسه قيد التنفيذ */}
      {project.status === "in-progress" && (
        <div className="flex gap-4 mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
          <Button
            variant="accent"
            onClick={handleComplete}
            disabled={completeMutation.isPending}
          >
            {completeMutation.isPending
              ? "جاري الإنهاء..."
              : "إنهاء المشروع 🚀"}
          </Button>

          <Button
            className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? "جاري الإلغاء..." : "إلغاء المشروع"}
          </Button>
        </div>
      )}

      {/* المودال موجود دايماً ومربوط بالـ State، فمش هيختفي لما الـ status تتغير */}
      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmitReview={handleReviewSubmit}
        isPending={reviewMutation.isPending}
      />
    </>
  );
}
