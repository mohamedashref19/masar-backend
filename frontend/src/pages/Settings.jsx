import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSettingsSchema } from "../utils/validation";
import { useUpdateProfile } from "../features/settings/hooks/useUpdateProfile";
import { Button } from "../components"; // تأكد من مسار زرار الـ Button بتاعك

export default function Settings() {
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  // 🎯 مؤقتاً لحد ما نربط الـ Auth: هنفترض إن دي بيانات اليوزر اللي راجعة من الباك إند
  // غير الـ role لـ 'freelancer' عشان تشوف الفورم الكاملة
  const currentUser = {
    name: "كريم أشرف",
    role: "freelancer", // جرب تغيرها لـ 'client' وشوف الفورم هتتغير إزاي
    freelancerProfile: {
      title: "مطور واجهات أمامية",
      bio: "أنا كيكو، مطور ويب شغوف ببناء منصات سريعة وتجربة مستخدم ممتازة.",
      hourlyRate: 20,
      skills: ["React.js", "Tailwind CSS"],
    },
  };

  const isFreelancer = currentUser.role === "freelancer";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: currentUser.name,
      title: currentUser.freelancerProfile?.title || "",
      bio: currentUser.freelancerProfile?.bio || "",
      hourlyRate: currentUser.freelancerProfile?.hourlyRate || "",
      skills: currentUser.freelancerProfile?.skills || [],
    },
  });

  const currentSkills = watch("skills") || [];
  const [skillInput, setSkillInput] = useState("");

  // 🎯 دالة لإضافة المهارات لما المستقل يدوس Enter
  const handleAddSkill = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedSkill = skillInput.trim();
      if (trimmedSkill && !currentSkills.includes(trimmedSkill)) {
        setValue("skills", [...currentSkills, trimmedSkill]);
        setSkillInput(""); // تفريغ الحقل
      }
    }
  };

  // 🎯 دالة لمسح مهارة
  const handleRemoveSkill = (skillToRemove) => {
    setValue(
      "skills",
      currentSkills.filter((s) => s !== skillToRemove),
    );
  };

  const onSubmit = (data) => {
    // تجهيز الداتا عشان تتبعت للباك إند
    const payload = {
      name: data.name,
    };

    // لو هو مستقل، بنبعت بيانات البروفايل بتاعته (حسب هيكل الباك إند عندك)
    if (isFreelancer) {
      payload.freelancerProfile = {
        title: data.title,
        bio: data.bio,
        hourlyRate: Number(data.hourlyRate),
        skills: data.skills,
      };
    }

    updateProfile(payload);
  };

  return (
    <div className="container mx-auto py-12 px-4 mt-16 max-w-3xl">
      <div className="bg-primary border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-800 bg-slate-900/50">
          <h1 className="text-3xl font-bold text-heading">إعدادات الحساب</h1>
          <p className="text-slate-400 mt-2">
            قم بتحديث بياناتك الشخصية {isFreelancer && "وملفك المهني"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          {/* === البيانات الأساسية (تظهر للكل) === */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-secondary border-b border-slate-800 pb-2">
              البيانات الأساسية
            </h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">
                الاسم بالكامل
              </label>
              <input
                type="text"
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary transition-colors"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-xs text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>
          </div>

          {/* === بيانات المستقل (تظهر للمستقلين فقط) === */}
          {isFreelancer && (
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-xl font-bold text-secondary border-b border-slate-800 pb-2">
                الملف المهني
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-300">
                    المسمى الوظيفي
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: مطور واجهات أمامية"
                    className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary transition-colors"
                    {...register("title")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-300">
                    سعر الساعة ($)
                  </label>
                  <input
                    type="number"
                    placeholder="مثال: 15"
                    className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary transition-colors"
                    {...register("hourlyRate")}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">
                  النبذة التعريفية
                </label>
                <textarea
                  rows="4"
                  placeholder="اكتب نبذة عنك وعن خبراتك..."
                  className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-secondary transition-colors resize-none"
                  {...register("bio")}
                ></textarea>
              </div>

              {/* === قسم المهارات (إضافة وحذف) === */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">
                  المهارات (اضغط Enter للإضافة)
                </label>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 min-h-[50px] flex flex-wrap gap-2 focus-within:border-secondary transition-colors">
                  {currentSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-slate-800 text-slate-200 px-3 py-1 rounded-md text-sm flex items-center gap-2 border border-slate-600"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-red-400 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder={
                      currentSkills.length === 0 ? "مثال: React.js" : ""
                    }
                    className="bg-transparent border-none outline-none text-slate-200 flex-1 min-w-[120px]"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800">
            <Button
              type="submit"
              variant="accent"
              className="w-full md:w-auto px-10"
              disabled={isPending}
            >
              {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
