import { useParams, useNavigate } from "react-router-dom";
import { useProjectDetails } from "./useProjectDetails";
import { useSelector } from "react-redux";
import { useState } from "react";

export const useProjectDetailsLogic = () => {
  const { id } = useParams(); // بنسحب الـ ID من الـ URL
  const navigate = useNavigate();

  // بنجيب بيانات المستخدم الحالي عشان نعرف هو Client ولا Freelancer
  const { user } = useSelector((state) => state.auth);

  const { data, isLoading, isError, error } = useProjectDetails(id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyClick = () => {
    // لو مش مسجل دخول، وديه للوجين
    if (!user) {
      navigate("/login", { state: { from: `/projects/${id}` } });
      return;
    }

    // مستقبلاً: هنا هنفتح الـ Modal بتاع تقديم العرض
    setIsModalOpen(true);
  };

  return {
    // الباك إند بيرجع الداتا جوه response.data.data
    project: data?.data,
    isLoading,
    isError,
    errorMessage: error?.message || "حدث خطأ أثناء تحميل تفاصيل المشروع",
    userRole: user?.role, // Client ولا Freelancer
    isOwner: user?._id === data?.data?.client?._id, // هل هو صاحب المشروع؟
    onApplyClick: handleApplyClick,
    projectId: id, // هنحتاج نمرر ده
    isModalOpen,
    closeModal: () => setIsModalOpen(false),
  };
};
