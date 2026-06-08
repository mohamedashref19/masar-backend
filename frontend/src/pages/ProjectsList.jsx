import { useProjectsListLogic } from "../features/projects/hooks/useProjectsListLogic";
import ProjectCard from "../features/projects/components/ProjectCard";

export default function ProjectsList() {
  const { projects, isLoading, isError, errorMessage } = useProjectsListLogic();
  console.log("ProjectsList rendered with:", {
    projects,
    isLoading,
    isError,
    errorMessage,
  });
  // حالة التحميل
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
      </div>
    );
  }

  // حالة الخطأ
  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-500">
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 mt-16">
      <div className="mb-10 text-center md:text-right">
        <h1 className="text-3xl font-bold text-heading mb-2">
          تصفح المشاريع المتاحة
        </h1>
        <p className="text-slate-400">
          اكتشف أحدث المشاريع وابدأ في تقديم عروضك الآن.
        </p>
      </div>

      {/* عرض المشاريع أو رسالة لو مفيش مشاريع */}
      {projects.projects.length === 0 ? (
        <div className="text-center py-20 bg-primary rounded-xl border border-slate-800">
          <p className="text-slate-400 text-lg">
            لا توجد مشاريع متاحة في الوقت الحالي.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
