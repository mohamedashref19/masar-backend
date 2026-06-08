import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createProject } from "../services/projectsApi";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      console.log("Project created successfully:", data);
      toast.success("تم نشر المشروع بنجاح! 🚀");
      // بنعمل Invalidate عشان لو هو فاتح صفحة المشاريع تتحدث أوتوماتيك
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      console.log(data);
      // نرجعه للوحة التحكم بتاعته
      navigate("/client-dashboard");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "حدث خطأ أثناء نشر المشروع";
      toast.error(message);
    },
  });
};
