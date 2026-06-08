import { useQuery } from "@tanstack/react-query";
import { getMyProposals } from "../../proposals/services/porposalsApi";

export const useFreelancerDashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-proposals"],
    queryFn: () => getMyProposals(),
  });

  // استخراج العروض بأمان
  const proposals =
    data?.data?.proposals || data?.proposals || data?.data || [];

  // 🎯 حساب إحصائيات المستقل بناءً على حالة العرض
  const stats = {
    total: proposals.length,
    pending: proposals.filter((p) => p.status === "pending").length,
    accepted: proposals.filter((p) => p.status === "accepted").length,
    rejected: proposals.filter((p) => p.status === "rejected").length,
  };

  return {
    proposals,
    stats,
    isLoading,
    isError,
  };
};
