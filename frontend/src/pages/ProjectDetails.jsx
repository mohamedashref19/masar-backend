import { useProjectDetailsLogic } from "../features/projects/hooks/useProjectDetailsLogic";
import { Button } from "../components"; // زرار الـ UI بتاعك
import { format } from "date-fns"; // هنحتاجها عشان نظبط شكل التاريخ
import { ar } from "date-fns/locale"; // لتعريب التاريخ

import ApplyProposalModal from "../features/proposals/components/ApplyProposalModal";

export default function ProjectDetails() {
  const {
    project,
    isLoading,
    isError,
    errorMessage,
    userRole,
    isOwner,
    onApplyClick,
    projectId,
    isModalOpen,
    closeModal,
  } = useProjectDetailsLogic();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-500">
        <p>{errorMessage || "المشروع غير موجود."}</p>
      </div>
    );
  }

  // تنسيق التاريخ اللي راجع من الباك إند
  const formattedDeadline = format(new Date(project.deadline), "dd MMMM yyyy", {
    locale: ar,
  });
  const formattedCreatedAt = format(
    new Date(project.createdAt),
    "dd MMMM yyyy",
    { locale: ar },
  );

  return (
    <div className="container mx-auto py-12 px-4 mt-16 max-w-4xl">
      {/* الهيدر: العنوان والسعر */}
      <div className="bg-primary p-8 rounded-xl border border-slate-800 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-heading">{project.title}</h1>
          <div className="bg-slate-800 text-secondary px-6 py-2 rounded-lg text-lg font-bold border border-secondary/20">
            {project.budget} $
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
          <span className="flex items-center gap-1">
            <span className="text-slate-500">القسم:</span> {project.category}
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1">
            <span className="text-slate-500">نُشر في:</span>{" "}
            {formattedCreatedAt}
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1 text-red-400">
            <span className="text-slate-500">الموعد النهائي:</span>{" "}
            {formattedDeadline}
          </span>
        </div>

        {/* المهارات المطلوبة */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">
            المهارات المطلوبة:
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.skillsRequired.map((skill, index) => (
              <span
                key={index}
                className="bg-slate-900 text-slate-300 text-sm px-3 py-1.5 rounded border border-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* زر التقديم (يظهر للمستقلين بس) */}
        {!isOwner && userRole !== "client" && project.status === "open" && (
          <Button
            variant="accent"
            className="w-full md:w-auto mt-4 px-8"
            onClick={onApplyClick}
          >
            قدّم عرضك الآن
          </Button>
        )}
      </div>

      {/* تفاصيل المشروع */}
      <div className="bg-primary p-8 rounded-xl border border-slate-800 shadow-xl">
        <h2 className="text-2xl font-bold text-heading mb-6 border-b border-slate-800 pb-4">
          تفاصيل المشروع
        </h2>
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed">
          {project.description}
        </div>
      </div>
      {/* إضافة المودال في آخر الصفحة */}
      <ApplyProposalModal
        isOpen={isModalOpen}
        onClose={closeModal}
        projectId={projectId}
      />
    </div>
  );
}
