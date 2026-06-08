import CreateProjectForm from "../features/projects/components/CreateProjectForm";
import { useCreateProject } from "../features/projects/hooks/useCreateProject";
import { analyzeProject } from "../services/geminiService";
import toast from "react-hot-toast";
import { useState } from "react";
export default function PostJob() {
  const { mutate: createProjectMutate, isPending } = useCreateProject();
  const [isAnalyzing, setIsAnalyzing] = useState(false); // حالة تحميل الـ AI
  const onSubmit = async (data) => {
    setIsAnalyzing(true);
    toast.loading("جاري تحليل المشروع بواسطة الذكاء الاصطناعي... 🤖");

    try {
      // 1. طلب التحليل من جيميناي
      const aiAnalysis = await analyzeProject(data);

      // 2. تظهير الداتا ودمج نتائج الـ AI
      const formattedData = {
        ...data,
        skillsRequired: data.skillsRequired.split(",").map((s) => s.trim()),
        // إضافة الخصائص اللي جيميناي رجعها
        complexity: aiAnalysis.complexity,
        required_skills: aiAnalysis.required_skills,
        experience_required: aiAnalysis.experience_required,
      };

      toast.dismiss(); // مسح رسالة التحميل

      // 3. إرسال الريكويست للباك إند
      createProjectMutate(formattedData);
    } catch (error) {
      toast.dismiss();
      toast.error("فشل التحليل، سيتم نشر المشروع ببياناتك فقط.");
      createProjectMutate(data); // إرسال عادي لو الـ AI فشل
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 mt-16">
      <CreateProjectForm onSubmit={onSubmit} isLoading={isPending} />
    </div>
  );
}
