import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../services/settingsApi";
import Swal from "sweetalert2";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      // بنعمل ريفريش لبيانات اليوزر بعد التعديل
      queryClient.invalidateQueries(["user", "me"]);
      Swal.fire({
        title: "تم التحديث!",
        text: "تم تحديث بياناتك بنجاح.",
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
        text: error.response?.data?.message || "حدث خطأ أثناء التحديث",
        icon: "error",
        background: "#1e293b",
        color: "#fff",
      });
    },
  });
};
