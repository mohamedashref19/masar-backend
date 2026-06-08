import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSettingsSchema } from "../../../utils/validation";
import { useUpdateProfile } from "./useUpdateProfile";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../auth/services/authApi"; // استيراد دالة الجلب

export const useClientSettingsLogic = () => {
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  // 🎯 جلب بيانات العميل الحقيقية من الباك إند
  const { data: userData, isLoading: isFetching } = useQuery({
    queryKey: ["user", "me"],
    queryFn: getMe,
  });

  const form = useForm({
    resolver: zodResolver(clientSettingsSchema),
    defaultValues: {
      name: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  // 🎯 تحديث الفورم أول ما الداتا تيجي
  useEffect(() => {
    const realUser =
      userData?.data?.user || userData?.user || userData?.data || userData;

    if (realUser && realUser.name) {
      reset({
        name: realUser.name || "",
      });
    }
  }, [userData, reset]);

  const onSubmit = (data) => {
    updateProfile({ name: data.name });
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isPending: isUpdating,
    isFetching, // عشان نعرض بيه اللودينج
  };
};
