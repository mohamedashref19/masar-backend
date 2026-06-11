import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { freelancerSettingsSchema } from "../../../utils/validation";
import { useUpdateProfile } from "./useUpdateProfile";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../auth/services/authApi";

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
      portfolioLinks: [], // 🎯 تسجيل الحقل رسمياً في الـ Form State
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
  useEffect(() => {
    const realUser =
      userData?.data?.user || userData?.user || userData?.data || userData;
    console.log("Real User Data:", realUser);

    if (realUser && realUser.name) {
      reset({
        name: realUser.name || "",
        title: realUser.freelancerProfile?.title || "",
        bio: realUser.freelancerProfile?.bio || "",
        hourlyRate: realUser.freelancerProfile?.hourlyRate || "",
        skills: realUser.freelancerProfile?.skills || [],
        githubLink: realUser.freelancerProfile?.githubLink || "",
        portfolioLinks: realUser.freelancerProfile?.portfolioLinks || [], // 🎯 سحب الروابط المخزنة وتعبئتها
      });
    }
  }, [userData, reset]);

  // 🛠️ لوجيك إدارة المهارات (كما هو)
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

  // 🎯 👑 لوجيك إدارة روابط الـ Portfolio التفاعلية الجديدة
  const portfolioLinks = watch("portfolioLinks") || [];
  const [portfolioInput, setPortfolioInput] = useState("");

  const handleAddPortfolioLink = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      const trimmedLink = portfolioInput.trim();

      // تأمين عدم التكرار وضمان وجود داتا
      if (trimmedLink && !portfolioLinks.includes(trimmedLink)) {
        setValue("portfolioLinks", [...portfolioLinks, trimmedLink], {
          shouldDirty: true,
        });
        setPortfolioInput(""); // تصفير الحقل
      }
    }
  };

  const handleRemovePortfolioLink = (linkToRemove) => {
    setValue(
      "portfolioLinks",
      portfolioLinks.filter((link) => link !== linkToRemove),
      { shouldDirty: true },
    );
  };

  const onSubmit = (data) => {
    console.log("البيانات الحية الموجهة للباك إند:", data);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("freelancerProfile[title]", data.title || "");
    formData.append("freelancerProfile[bio]", data.bio || "");
    formData.append("freelancerProfile[hourlyRate]", data.hourlyRate || 0);
    formData.append("freelancerProfile[githubLink]", data.githubLink || "");

    // 1. ترحيل المهارات
    if (data.skills) {
      data.skills.forEach((skill) =>
        formData.append("freelancerProfile[skills][]", skill),
      );
    }

    // 2. 🎯 ترحيل روابط الـ Portfolio المحدثة صراحة للـ FormData
    if (data.portfolioLinks) {
      data.portfolioLinks.forEach((link) =>
        formData.append("freelancerProfile[portfolioLinks][]", link),
      );
    }

    // 3. ترحيل ملف الـ CV لو مرفوع حالا
    if (data.cv && data.cv.length > 0) {
      formData.append("cv", data.cv[0]);
    }

    updateProfile(formData);
  };

  // 🎯 التعديل الحرج: استخراج الـ hasCv من نفس الكائن المؤمن اللي بيفرش الفورم
  const realUser =
    userData?.data?.user || userData?.user || userData?.data || userData;
  const hasCv = !!realUser?.freelancerProfile?.cv;

  return {
    register,
    handleSubmit,
    errors,
    hasCv, // الحين هيفضل منور أخضر لايف بعد الريفرش
    onSubmit,
    isPending: isUpdating,
    isFetching,
    currentSkills,
    skillInput,
    setSkillInput,
    handleAddSkill,
    handleRemoveSkill,
    portfolioLinks,
    portfolioInput,
    setPortfolioInput,
    handleAddPortfolioLink,
    handleRemovePortfolioLink,
  };
};
