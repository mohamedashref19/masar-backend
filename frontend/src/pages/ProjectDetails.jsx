import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
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
import { FiFolder, FiCalendar, FiClock, FiLayers, FiCpu } from "react-icons/fi";

export default function ProjectDetails() {
  const { projectId: urlProjectId } = useParams();

  const {
    project,
    isLoading,
    isError,
    errorMessage,
    userRole,
    isOwner,
    onApplyClick,
    projectId: logicProjectId,
    isModalOpen,
    closeModal,
  } = useProjectDetailsLogic();

  const actualProjectId = urlProjectId || logicProjectId;

  const {
    milestones,
    isLoading: isLoadingMilestones,
    createMilestoneMutate,
    isCreating,
    ...milestoneActions
  } = useMilestones(actualProjectId);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#080B10] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
        <span className="text-xs text-slate-500 font-medium">
          جاري مزامنة كراسة الشروط الفنية...
        </span>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div
        dir="rtl"
        className="flex flex-col justify-center items-center min-h-screen bg-[#080B10] text-center p-4"
      >
        <span className="text-4xl mb-4">🔍</span>
        <p className="text-red-400 font-bold text-sm">
          {errorMessage || "المشروع غير موجود في قاعدة بيانات مسار."}
        </p>
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

  // دالة ذكية لتلوين شارة حالة المشروع الحالية بكرة أمام اللجنة
  const getStatusBadge = (status) => {
    if (status === "open")
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (status === "in-progress" || status === "in_progress")
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-green-500/10 text-green-400 border-green-500/20"; // completed
  };

  return (
    <div
      dir="rtl"
      className="container mx-auto py-12 px-4 mt-20 max-w-4xl space-y-6 text-right selection:bg-secondary/30 font-['Outfit'] relative"
    >
      {/* هالة توهج خلفية ناعمة */}
      <div className="absolute top-10 right-1/4 w-96 h-96 rounded-full bg-secondary/[0.02] blur-[130px] pointer-events-none" />

      {/* 1. كارت الهيدر الأساسي (Bento Block) */}
      <div className="bg-[#0D121A] p-6 md:p-8 rounded-2xl border border-white/[0.05] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {project.project.title}
              </h1>
              <span
                className={`text-[10px] font-bold border px-2.5 py-0.5 rounded-md ${getStatusBadge(project.project.status)}`}
              >
                {project.project.status === "open"
                  ? "📬 مفتوح للتقديم"
                  : project.project.status === "completed"
                    ? "✅ مكتمل"
                    : "⚡ قيد التنفيذ ماليًا"}
              </span>
            </div>
          </div>

          <div
            className="bg-secondary/5 text-secondary px-5 py-2 rounded-xl text-xl font-black border border-secondary/20 shrink-0"
            dir="ltr"
          >
            $ {project.project.budget}
          </div>
        </div>

        {/* شارات البيانات الفنية الصغيرة والنظيفة */}
        <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-6">
          <span className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.04] px-3 py-1.5 rounded-lg">
            <FiFolder className="text-slate-500" />{" "}
            <span className="text-slate-500">القسم:</span>{" "}
            {project.project.category}
          </span>
          <span className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.04] px-3 py-1.5 rounded-lg">
            <FiCalendar className="text-slate-500" />{" "}
            <span className="text-slate-500">نُشر في:</span>{" "}
            {formattedCreatedAt}
          </span>
          <span className="flex items-center gap-1.5 bg-red-500/5 border border-red-500/10 text-red-400 px-3 py-1.5 rounded-lg">
            <FiClock /> <span className="text-red-500/60">الموعد النهائي:</span>{" "}
            {formattedDeadline}
          </span>
        </div>

        <div className="pt-5 border-t border-white/[0.04]">
          <h3 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <FiCpu className="text-secondary" /> المهارات المستهدفة للمشروع:
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {project.project?.skillsRequired?.map((skill, index) => (
              <span
                key={index}
                className="bg-slate-950 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-white/[0.04]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* زر التقديم الخاص بالمستقل الموثق */}
        {!isOwner &&
          userRole !== "client" &&
          project.project.status === "open" && (
            <Button
              variant="accent"
              className="w-full md:w-auto mt-6 py-3.5 px-10 font-bold text-xs rounded-xl shadow-[0_10px_25px_rgba(228,255,0,0.1)] hover:shadow-[0_10px_25px_rgba(228,255,0,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all text-slate-950"
              onClick={onApplyClick}
            >
              🚀 قدّم عرضك التقني الآن
            </Button>
          )}
      </div>

      {/* 2. كارت تفاصيل ووصف المشروع */}
      <div className="bg-[#0D121A] p-6 md:p-8 rounded-2xl border border-white/[0.05] shadow-2xl relative">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-white/[0.04] pb-3">
          <FiLayers className="text-secondary" /> كراسة الشروط والمواصفات
          المتوقعة
        </h2>
        <div className="prose prose-invert max-w-none text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-light">
          {project.project.description}
        </div>

        {isOwner && (
          <div className="mt-6 pt-4 border-t border-white/[0.04]">
            <ProjectActionsForClient project={project} />
          </div>
        )}
      </div>

      {/* 3. كارت الـ Escrow & Milestones */}
      {(project.project?.status === "in-progress" ||
        project.project?.status === "in_progress" ||
        (milestones && milestones?.length > 0)) && (
        <div className="bg-[#0D121A] p-6 md:p-8 rounded-2xl border border-white/[0.05] shadow-2xl">
          <h2 className="text-base font-bold text-white mb-4 border-b border-white/[0.04] pb-3 flex items-center gap-1.5">
            🛡️ مخطط الدفع وحماية المستحقات المالي (Escrow System)
          </h2>

          {isOwner &&
            (project.project?.status === "in-progress" ||
              project.project?.status === "in_progress") && (
              <div className="mb-6 p-4 bg-slate-950/40 border border-white/[0.04] rounded-xl">
                <CreateMilestoneForm
                  onAddMilestone={(milestoneData, config) =>
                    createMilestoneMutate(
                      { projectId: actualProjectId, milestoneData },
                      {
                        ...config,
                        onSuccess: () => {
                          toast.success(
                            "تم إيداع الدفعة بنجاح في المحفظة الوسيطة! 💳",
                          );
                          if (config?.onSuccess) config.onSuccess();
                        },
                      },
                    )
                  }
                  isLoading={isCreating}
                />
              </div>
            )}

          {isLoadingMilestones ? (
            <div className="text-center py-8 text-slate-500 animate-pulse text-xs font-medium">
              🔄 جاري فحص ومزامنة الدفعات الوسيطة في الـ Ledger...
            </div>
          ) : (
            <MilestonesList
              milestones={milestones || []}
              projectId={actualProjectId}
              userRole={userRole}
              isOwner={isOwner}
              actions={milestoneActions}
            />
          )}
        </div>
      )}

      {/* 4. قائمة العروض للعميل */}
      {isOwner && project.project.status === "open" && (
        <div className="bg-[#0D121A] p-6 md:p-8 rounded-2xl border border-white/[0.05] shadow-2xl">
          <ClientProposalsList
            projectId={
              project.project._id || project.project.id || actualProjectId
            }
            projectStatus={project.project.status}
          />
        </div>
      )}

      {/* المودال العائم لتقديم العروض */}
      <ApplyProposalModal
        isOpen={isModalOpen}
        onClose={closeModal}
        projectId={actualProjectId}
      />
    </div>
  );
}
