import { useProjects } from "./useProjects";

export const useProjectsListLogic = () => {
  // بنجيب البيانات من الـ React Query
  const { data, isLoading, isError, error } = useProjects("");

  return {
    // الباك إند بتاعك بيرجع الداتا جوه response.data، فعشان كدة بنعمل data?.data
    projects: data?.data || [],
    isLoading,
    isError,
    errorMessage: error?.message || "حدث خطأ أثناء جلب المشاريع",
  };
};
