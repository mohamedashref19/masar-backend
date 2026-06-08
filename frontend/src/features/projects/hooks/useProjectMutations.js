import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteProject, updateProject } from "../services/projectsApi";
import Swal from "sweetalert2";

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      // بنعمل ريفريش لبيانات المشاريع عشان المشروع يختفي من الشاشة فوراً
      queryClient.invalidateQueries(["projects"]);

      Swal.fire({
        title: "تم الحذف!",
        text: "تم حذف المشروع بنجاح.",
        icon: "success",
        background: "#1e293b",
        color: "#fff",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "خطأ!",
        text: error.response?.data?.message || "حدث خطأ أثناء حذف المشروع",
        icon: "error",
        background: "#1e293b",
        color: "#fff",
      });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: updateProject, // دي الدالة اللي عملناها في الخطوة اللي فاتت
    onSuccess: () => {
      // ريفريش لكل المشاريع عشان التعديل يسمّع في كل حته
      queryClient.invalidateQueries(["projects"]);

      Swal.fire({
        title: "تم التعديل!",
        text: "تم تحديث بيانات المشروع بنجاح.",
        icon: "success",
        background: "#1e293b",
        color: "#fff",
        timer: 2000,
        showConfirmButton: false,
      });

      // نرجع العميل للداشبورد بعد التعديل
      navigate("/client-dashboard"); // اتأكد إن ده نفس مسار الداشبورد عندك
    },
    onError: (error) => {
      Swal.fire({
        title: "خطأ!",
        text: error.response?.data?.message || "حدث خطأ أثناء تعديل المشروع",
        icon: "error",
        background: "#1e293b",
        color: "#fff",
      });
    },
  });
};
