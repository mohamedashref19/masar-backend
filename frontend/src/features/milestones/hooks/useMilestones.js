import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getProjectMilestones,
  createMilestone, // 🎯 1. تأكد من استيراد دالة الإنشاء هنا
  submitMilestoneWork,
  approveMilestoneWork,
} from "../services/api";

export const useMilestones = (projectId) => {
  const queryClient = useQueryClient();

  // جلب البيانات من السيرفر
  const { data, isLoading, isError } = useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => getProjectMilestones(projectId),
    enabled: !!projectId,
  });

  // 🎯 2. إضافة الميوتيشن المفقودة لإنشاء الـ Milestone
  const createMutation = useMutation({
    mutationFn: createMilestone,
    onSuccess: () => {
      toast.success("تم إنشاء المرحلة بنجاح! 📑");
      // ريفريش لحظي للمراحل عشان تنزل في الـ List فوراً
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل إنشاء المرحلة");
    },
  });

  // ميوتيشن التسليم (Submit)
  const submitWorkMutation = useMutation({
    mutationFn: submitMilestoneWork,
    onSuccess: () => {
      toast.success("تم تسليم ملفات المرحلة بنجاح! 🚀 قيد مراجعة العميل.");
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء تسليم العمل");
    },
  });

  // ميوتيشن الموافقة والاعتماد (Approve)
  const approveWorkMutation = useMutation({
    mutationFn: approveMilestoneWork,
    onSuccess: () => {
      toast.success("تمت الموافقة على المرحلة واعتمادها بنجاح! 🎉");
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء اعتماد المرحلة",
      );
    },
  });

  // جوه الـ return بتاع useMilestones.js
  return {
    milestones: (() => {
      // 1. استخراج الكبسولة الداخلية للداتا
      const innerData = data?.data || data;

      // 2. لو الباك إند باعتها جوه حقل الجمع "milestones"
      if (innerData?.milestones && Array.isArray(innerData.milestones)) {
        return innerData.milestones;
      }

      // 3. لو الباك إند باعت عنصر واحد مفرد "milestone" (زي الـ JSON اللي أنت باعته حالا)
      if (innerData?.milestone && !Array.isArray(innerData.milestone)) {
        return [innerData.milestone]; // بنحوله لمصفوفة جواها عنصر واحد فوراً عشان الـ .map() تشتغل!
      }

      // 4. لو الداتا الراجعة هي الـ Array الصافية مباشرة
      if (Array.isArray(innerData)) {
        return innerData;
      }

      return []; // حزام أمان ملوكي
    })(),

    isLoadingMilestones: isLoading,
    isErrorMilestones: isError,
    createMilestoneMutate: createMutation.mutate,
    isCreating: createMutation.isPending,
    submitWorkMutate: submitWorkMutation.mutate,
    isSubmittingWork: submitWorkMutation.isPending,
    approveWorkMutate: approveWorkMutation.mutate,
    isApprovingWork: approveWorkMutation.isPending,
  };
};
