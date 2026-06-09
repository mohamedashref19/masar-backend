import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCreateProject } from "../features/projects/hooks/useCreateProject";
import Button from "../components/Button";
import toast from "react-hot-toast";

export default function PostJob() {
  const location = useLocation();
  const { mutate: createProjectMutate, isPending } = useCreateProject();
  const aiPrefilledData = location.state?.prefilledProjectData || null;

  const { register, handleSubmit, reset } = useForm({
    defaultValues: aiPrefilledData || {
      title: "",
      description: "",
      category: "",
      budget: "",
      deadline: "",
      skillsRequired: "",
      complexity: "Medium",
      experience_required: "Intermediate",
    },
  });

  useEffect(() => {
    if (aiPrefilledData) {
      // 🎯 تحويل مصفوفة المهارات لنص مفصول بفاصلة ليعرض بسلاسة داخل الـ Input
      const normalizedData = {
        ...aiPrefilledData,
        skillsRequired: Array.isArray(aiPrefilledData.skillsRequired)
          ? aiPrefilledData.skillsRequired.join(", ")
          : aiPrefilledData.skillsRequired || "",
      };
      reset(normalizedData);
      toast.success(
        "✨ مذهل! قام ذكاء مسار بتعبئة الحقول من محادثتك الحية بنسبة 100%",
      );
    }
  }, [aiPrefilledData, reset]);

  const onSubmit = (formData) => {
    console.log("البيانات المستلمة من الفورم قبل التنظيف والـ POST:", formData);

    // الحقول الأخرى كما هي...
    const skillsArray =
      typeof formData.skillsRequired === "string"
        ? formData.skillsRequired
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(formData.skillsRequired)
          ? formData.skillsRequired
          : [];

    let cleanComplexity = "Medium";
    const rawComplexity = String(formData.complexity).toLowerCase();
    if (rawComplexity.includes("low") || rawComplexity.includes("easy"))
      cleanComplexity = "Low";
    if (rawComplexity.includes("high") || rawComplexity.includes("hard"))
      cleanComplexity = "High";

    let cleanExperience = "Intermediate";
    const rawExperience = String(formData.experience_required).toLowerCase();
    if (rawExperience.includes("begin") || rawExperience.includes("entry"))
      cleanExperience = "Beginner";
    if (rawExperience.includes("expert")) cleanExperience = "Expert";

    const cleanBudget = formData.budget ? Number(formData.budget) : 1000;

    // 🎯 الحل المعتمد والمطابق لقواعد الـ Purity في React 19:
    let cleanDeadline;

    // لقطة الوقت الحالي بنحسبها في متغير منفصل تماماً جوه الـ Event Handler لمنع الـ Render Violation
    const currentTimeStamp = new Date().getTime();

    if (formData.deadline) {
      const chosenDate = new Date(formData.deadline);

      // تأمين فارق التوقيت وثبيت نهاية اليوم
      chosenDate.setHours(23, 59, 59, 999);

      // 🎯 المقارنة هنا أصبحت بين متغيرين (Pure Numbers) ومفيش أي استدعاء لـ دالة خارجية جوه الـ If
      if (chosenDate.getTime() <= currentTimeStamp) {
        const futureFallback = new Date();
        futureFallback.setDate(futureFallback.getDate() + 30);
        cleanDeadline = futureFallback.toISOString();
      } else {
        cleanDeadline = chosenDate.toISOString();
      }
    } else {
      const futureFallback = new Date();
      futureFallback.setDate(futureFallback.getDate() + 30);
      cleanDeadline = futureFallback.toISOString();
    }

    // تجميع الـ Payload وإرساله للـ mutate...
    const finalPayload = {
      title: formData.title,
      description: formData.description,
      category: formData.category || "Web Development",
      budget: cleanBudget,
      deadline: cleanDeadline,
      complexity: cleanComplexity,
      skillsRequired: skillsArray,
      required_skills: skillsArray,
      experience_required: cleanExperience,
    };

    toast.loading("جاري نشر مشروعك الذكي وتوثيقه على السيرفر... 🚀");

    createProjectMutate(finalPayload, {
      onSuccess: () => {
        toast.dismiss();
        toast.success("تم نشر مشروعك بنجاح على منصة مسار! 🎉");
        reset();
      },
      onError: (error) => {
        toast.dismiss();
        toast.error(error?.message || "حدث خطأ أثناء النشر على السيرفر.");
      },
    });
  };

  return (
    <div className="container mx-auto py-12 px-4 mt-16 max-w-3xl">
      <div className="bg-primary p-8 rounded-xl border border-slate-800 shadow-xl">
        {aiPrefilledData && (
          <div className="mb-8 p-4 bg-secondary/10 border border-secondary/20 rounded-xl flex items-start gap-4">
            <span className="text-3xl">🤖</span>
            <div>
              <h3 className="text-secondary font-bold text-sm mb-1">
                تعبئة ذكية نشطة (Gemini Pipeline)
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                قمت بتحليل المحادثة وصياغة وصف فني دقيق، واختيار المهارات
                والميزانية الأنسب. يمكنك التعديل على أي خانة بحرية قبل الإطلاق
                المباشر.
              </p>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-heading mb-6 border-b border-slate-800 pb-4">
          نشر مشروع جديد
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm mb-2">
                عنوان المشروع
              </label>
              <input
                {...register("title")}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-secondary text-sm text-right"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm mb-2">
                الوصف المتوقع للمشروع
              </label>
              <textarea
                {...register("description")}
                rows={5}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-secondary text-sm leading-relaxed text-right"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">القسم</label>
              <input
                {...register("category")}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-secondary text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">
                الميزانية المقترحة ($)
              </label>
              <input
                type="number"
                {...register("budget")}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-secondary text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">
                تاريخ التسليم المتوقع
              </label>
              <input
                type="date"
                {...register("deadline")}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-secondary text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">
                المهارات المستخرجة (مفصول بفاصلة)
              </label>
              <input
                {...register("skillsRequired")}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-secondary text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">
                مستوى التعقيد
              </label>
              <input
                {...register("complexity")}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-secondary text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">
                الخبرة المطلوبة
              </label>
              <input
                {...register("experience_required")}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-secondary text-sm"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="accent"
            disabled={isPending}
            className="w-full mt-8 py-3 text-sm font-bold disabled:opacity-50"
          >
            {isPending
              ? "جاري النشر الفعلي..."
              : "اعتماد ونشر المشروع النهائي ✔️"}
          </Button>
        </form>
      </div>
    </div>
  );
}
