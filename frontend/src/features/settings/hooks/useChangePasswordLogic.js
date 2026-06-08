import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../../../utils/validation";
import { useMutation } from "@tanstack/react-query";
import { updateMyPassword } from "../services/settingsApi";
import Swal from "sweetalert2";

export const useChangePasswordLogic = () => {
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      passwordCurrent: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: updateMyPassword,
    onSuccess: (data) => {
      // 💡 ملحوظة هامة: الباك إند غالباً بيبعت توكن جديد بعد تغيير الباسورد
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      Swal.fire({
        title: "تم التحديث!",
        text: "تم تغيير كلمة المرور بنجاح.",
        icon: "success",
        background: "#1e293b",
        color: "#fff",
        timer: 2000,
        showConfirmButton: false,
      });
      reset(); // تفريغ الحقول بعد النجاح
    },
    onError: (error) => {
      Swal.fire({
        title: "خطأ!",
        text: error.response?.data?.message || "كلمة المرور الحالية غير صحيحة",
        icon: "error",
        background: "#1e293b",
        color: "#fff",
      });
    },
  });

  const onSubmit = (data) => {
    // هنعمل "كوكتيل" بأسماء الحقول عشان نرضي الباك إند أياً كانت الأسماء اللي مستنيها
    const payload = {
      passwordCurrent: data.passwordCurrent, // الاسم المعتاد
      currentPassword: data.passwordCurrent, // احتمال الباك إند

      password: data.password, // الاسم المعتاد
      newPassword: data.password, // احتمال الباك إند

      passwordConfirm: data.passwordConfirm, // ده غالباً ثابت
    };

    changePassword(payload);
  };

  return { register, handleSubmit, errors, onSubmit, isPending };
};
