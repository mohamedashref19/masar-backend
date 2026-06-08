import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { freelancerSettingsSchema } from "../../../utils/validation";
import { useUpdateProfile } from "./useUpdateProfile";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../auth/services/authApi"; // استيراد دالة الجلب

export const useFreelancerSettingsLogic = () => {
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  // 🎯 جلب بيانات المستخدم الحقيقية من الباك إند
  const { data: userData, isLoading: isFetching } = useQuery({
    queryKey: ["user", "me"],
    queryFn: getMe,
  });

  const form = useForm({
    resolver: zodResolver(freelancerSettingsSchema),
    defaultValues: {
      name: "",
      title: "",
      bio: "",
      hourlyRate: "",
      skills: [],
      githubLink: "",
      cv: null,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  // 🎯 تحديث الفورم أول ما الداتا الحقيقية ترجع من الباك إند
  // 🎯 تحديث الفورم أول ما الداتا الحقيقية ترجع من الباك إند
  useEffect(() => {
    // السطر ده هيكشفلنا الداتا اللي راجعة شكلها إيه بالظبط

    // استخراج ذكي بيغطي كل احتمالات الباك إند
    const realUser =
      userData?.data?.user || userData?.user || userData?.data || userData;
    console.log("Real User Data:", realUser);
    // لو لقينا يوزر وعنده اسم، هنعبي الفورم فوراً
    if (realUser && realUser.name) {
      // داخل useEffect في useFreelancerSettingsLogic
      reset({
        name: realUser.name || "",
        title: realUser.freelancerProfile?.title || "",
        bio: realUser.freelancerProfile?.bio || "",
        hourlyRate: realUser.freelancerProfile?.hourlyRate || "",
        skills: realUser.freelancerProfile?.skills || [],
        githubLink: realUser.freelancerProfile?.githubLink || "", // ضفنا ده
      });
    }
  }, [userData, reset]);

  const currentSkills = watch("skills") || [];
  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedSkill = skillInput.trim();
      if (trimmedSkill && !currentSkills.includes(trimmedSkill)) {
        setValue("skills", [...currentSkills, trimmedSkill], {
          shouldDirty: true,
        });
        setSkillInput("");
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setValue(
      "skills",
      currentSkills.filter((s) => s !== skillToRemove),
      { shouldDirty: true },
    );
  };

  const onSubmit = (data) => {
    console.log("البيانات اللي وصلت:", data); // دلوقتي هتلاقي الـ githubLink هنا!

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("freelancerProfile[title]", data.title);
    formData.append("freelancerProfile[bio]", data.bio);
    formData.append("freelancerProfile[hourlyRate]", data.hourlyRate);
    formData.append("freelancerProfile[githubLink]", data.githubLink || "");

    // المهارات
    if (data.skills) {
      data.skills.forEach((skill) =>
        formData.append("freelancerProfile[skills][]", skill),
      );
    }

    // هنا التعديل المهم: لو إنت مستخدم register("cv") والـ input type="file"
    // الـ data.cv غالباً هتكون FileList، لازم نتأكد إننا بناخد العنصر الأول
    if (data.cv && data.cv.length > 0) {
      formData.append("cv", data.cv[0]);
    }

    updateProfile(formData);
  };

  const hasCv = !!userData?.data?.user?.freelancerProfile?.cv;

  return {
    register,
    handleSubmit,
    errors,
    hasCv,
    onSubmit,
    isPending: isUpdating,
    isFetching, // ضفنا isFetching عشان نعمل لودينج للصفحة
    currentSkills,
    skillInput,
    setSkillInput,
    handleAddSkill,
    handleRemoveSkill,
  };
};
