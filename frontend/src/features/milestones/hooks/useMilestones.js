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

  return {
    milestones:
      data?.data?.milestones ||
      data?.milestones ||
      data?.data?.project?.milestones ||
      data?.project?.milestones ||
      data?.data ||
      [],

    isLoadingMilestones: isLoading,
    isErrorMilestones: isError,

    // 🎯 الآن التعريفات دي شغالة وسليمة 100%
    createMilestoneMutate: createMutation.mutate,
    isCreating: createMutation.isPending,

    submitWorkMutate: submitWorkMutation.mutate,
    isSubmittingWork: submitWorkMutation.isPending,
    approveWorkMutate: approveWorkMutation.mutate,
    isApprovingWork: approveWorkMutation.isPending,
  };
};
