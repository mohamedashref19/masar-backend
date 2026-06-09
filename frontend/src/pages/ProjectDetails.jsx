import { useProjectDetailsLogic } from "../features/projects/hooks/useProjectDetailsLogic";
import { Button } from "../components";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

import ApplyProposalModal from "../features/proposals/components/ApplyProposalModal";
import ClientProposalsList from "../features/proposals/components/ClientProposalsList";

// Milestones
import { useMilestones } from "../features/milestones/hooks/useMilestones";
import CreateMilestoneForm from "../features/milestones/components/CreateMilestoneForm";
import MilestonesList from "../features/milestones/components/MilestonesList";

import ProjectActionsForClient from "../features/projects/components/ProjectActionsForClient";

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

  const {
    milestones,
    isLoading: isLoadingMilestones,
    createMilestoneMutate,
    isCreating,
    ...milestoneActions
  } = useMilestones(projectId);

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

  const formattedDeadline = project.project?.deadline
    ? format(new Date(project.project.deadline), "dd MMMM yyyy", { locale: ar })
    : "تاريخ غير محدد";

  const formattedCreatedAt = project.project?.createdAt
    ? format(new Date(project.project.createdAt), "dd MMMM yyyy", {
        locale: ar,
      })
    : "تاريخ غير محدد";

  return (
    <div className="container mx-auto py-12 px-4 mt-16 max-w-4xl space-y-8">
      {/* 1. كارت الهيدر الأساسي */}
      <div className="bg-primary p-8 rounded-xl border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-heading">
            {project.project.title}
          </h1>
          <div className="bg-slate-800 text-secondary px-6 py-2 rounded-lg text-lg font-bold border border-secondary/20">
            {project.project.budget} $
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
          <span>
            <span className="text-slate-500">القسم:</span>{" "}
            {project.project.category}
          </span>
          <span className="text-slate-600">|</span>
          <span>
            <span className="text-slate-500">نُشر في:</span>{" "}
            {formattedCreatedAt}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-red-400">
            <span className="text-slate-500">الموعد النهائي:</span>{" "}
            {formattedDeadline}
          </span>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">
            المهارات المطلوبة:
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.project?.skillsRequired?.map((skill, index) => (
              <span
                key={index}
                className="bg-slate-900 text-slate-300 text-sm px-3 py-1.5 rounded border border-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {!isOwner &&
          userRole !== "client" &&
          project.project.status === "open" && (
            <Button
              variant="accent"
              className="w-full md:w-auto mt-4 px-8"
              onClick={onApplyClick}
            >
              قدّم عرضك الآن
            </Button>
          )}
      </div>

      {/* 2. كارت تفاصيل ووصف المشروع */}
      <div className="bg-primary p-8 rounded-xl border border-slate-800 shadow-xl">
        <h2 className="text-2xl font-bold text-heading mb-6 border-b border-slate-800 pb-4">
          تفاصيل المشروع
        </h2>
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed mb-6">
          {project.project.description}
        </div>

        {isOwner && <ProjectActionsForClient project={project} />}
      </div>

      {/* 3. كارت الـ Escrow & Milestones (يظهر فقط لو المشروع أصبح نشطاً أو قيد التنفيذ) */}
      {(project.project?.status === "in-progress" ||
        (milestones && milestones?.length > 0)) && (
        <div className="bg-primary p-8 rounded-xl border border-slate-800 shadow-xl">
          <h2 className="text-2xl font-bold text-heading mb-6 border-b border-slate-800 pb-4">
            مخطط الدفع وحماية المستحقات (Escrow System)
          </h2>

          {isOwner && project?.project?.status === "in-progress" && (
            <CreateMilestoneForm
              onAddMilestone={(milestoneData, config) =>
                createMilestoneMutate({ projectId, milestoneData }, config)
              }
              isLoading={isCreating}
            />
          )}

          {isLoadingMilestones ? (
            <div className="text-center py-4 text-slate-500 animate-pulse">
              جاري جلب بنود الدفع...
            </div>
          ) : (
            <MilestonesList
              milestones={milestones || []} // 🎯 تأمين بـ Array فاضية كـ ديفولت
              projectId={projectId}
              userRole={userRole}
              isOwner={isOwner}
              actions={milestoneActions}
            />
          )}
        </div>
      )}

      {/* 4. قائمة العروض للعميل (تختفي أوتوماتيك لو المشروع بدأ لتجنب الزحمة كما خططت) */}
      {isOwner && project.project.status === "open" && (
        <ClientProposalsList
          projectId={project.project._id || project.project.id || projectId}
          projectStatus={project.project.status}
        />
      )}

      <ApplyProposalModal
        isOpen={isModalOpen}
        onClose={closeModal}
        projectId={projectId}
      />
    </div>
  );
}
