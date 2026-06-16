import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiPlus, FiAlertTriangle } from "react-icons/fi";

import { useCreateProject } from "../features/projects/hooks/useCreateProject";
import CreateProjectForm from "../features/projects/components/CreateProjectForm";

export default function PostJob() {
  const { mutate: createProject, isPending } = useCreateProject();
  const navigate = useNavigate();
  const location = useLocation();

  const chatbotData = location.state?.chatbotProjectData || null;

  const normalizeSkills = (skills) => {
    if (Array.isArray(skills)) return skills.join(", ");
    if (typeof skills === "string") return skills;
    return "";
  };

  const prefilledData = chatbotData
    ? {
        title: chatbotData.title || "",
        description: chatbotData.description || "",
        category: chatbotData.category || "",
        budget: chatbotData.budget || "",
        deadline: chatbotData.deadline || "",
        skillsRequired: normalizeSkills(chatbotData.skillsRequired),
        complexity: chatbotData.complexity || "Medium",
        experience_required:
          chatbotData.experience_required || "Intermediate",
      }
    : null;

  const handleCreateProject = (formData) => {
    toast.loading(
      "جاري نشر كراسة الشروط الفنية وتوثيق المشروع على السيرفر... 🚀",
    );

    createProject(formData, {
      onSuccess: (data) => {
        toast.dismiss();
        toast.success("✨ مذهل! تم نشر مشروعك الذكي بنجاح على منصة مسار.");

        const projectId = data?.data?.project?._id || data?.project?._id;

        if (projectId) {
          navigate(`/projects/${projectId}`);
        } else {
          navigate("/dashboard");
        }
      },
      onError: (error) => {
        toast.dismiss();
        toast.error(
          error?.message || "حدث خطأ غير متوقع أثناء محاولة النشر المباشر.",
        );
      },
    });
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#080B10] text-slate-100 font-['Outfit'] relative selection:bg-secondary/30 text-right mt-16 md:mt-20 overflow-x-hidden"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-[450px] w-[450px] rounded-full bg-secondary/5 blur-[130px] animate-pulse" />
        <div className="absolute bottom-[-100px] left-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="container mx-auto py-12 md:py-16 px-4 md:px-6 max-w-4xl relative z-10">
        <div className="mb-10 pb-5 border-b border-white/[0.05] relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-full w-[100px] bg-secondary/5 blur-[50px] pointer-events-none" />

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center justify-center text-secondary text-2xl shadow-[0_8px_30px_rgba(228,255,0,0.05)]">
              <FiPlus />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                نشر مشروع تقني جديد
              </h1>
              <p className="text-body mt-1.5 text-xs md:text-sm font-light leading-relaxed max-w-xl">
                قم بصياغة شروطك الفنية واطرح كراسة المشروع بدقة. سيقوم ذكاء
                مسار بمطابقتك مع أفضل المستقلين والنخبة التقنية المسجلة بالمنصة
                فوراً.
              </p>
            </div>
          </div>
        </div>

        {chatbotData && (
          <div className="mb-10 p-5 bg-[#0D121A] border border-secondary/20 rounded-2xl flex flex-col md:flex-row items-center md:items-start gap-5 shadow-[0_20px_60px_-10px_rgba(228,255,0,0.02)] animate-fade-in-up">
            <div className="w-14 h-14 bg-secondary/10 border border-secondary/20 text-secondary rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 mt-1">
              🤖
            </div>

            <div className="flex-1 text-center md:text-right">
              <h3 className="text-secondary font-bold text-base flex items-center gap-2 justify-center md:justify-start">
                تم تعبئة الحقول ذكياً بواسطة مسار
              </h3>
              <p className="text-slate-300 text-xs mt-1.5 leading-relaxed font-light">
                لقد قمنا بتحليل تفاصيل محادثتك مع المساعد الذكي وصياغتها
                تقنياً. يمكنك مراجعة البيانات وتعديلها بحرية قبل إطلاق المشروع
                لايف.
              </p>
            </div>
          </div>
        )}

        <div className="bg-[#0D121A] border border-white/[0.05] rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

          <CreateProjectForm
            onSubmit={handleCreateProject}
            isLoading={isPending}
            prefilledData={prefilledData}
          />
        </div>

        <div className="mt-8 text-center flex items-center justify-center gap-1.5 text-[10px] text-slate-600 font-semibold uppercase tracking-wider mx-auto w-fit">
          <FiAlertTriangle className="text-secondary/70" />
          مسار Escrow Secured & Technical Vetting
        </div>
      </div>
    </div>
  );
}