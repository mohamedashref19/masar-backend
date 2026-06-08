import { useQuery } from "@tanstack/react-query";
import { getProjectProposals } from "../services/porposalsApi";

export const useProjectProposals = (projectId) => {
  return useQuery({
    queryKey: ["proposals", projectId],
    queryFn: () => getProjectProposals(projectId),
    enabled: !!projectId, // يشتغل بس لو الـ ID موجود
  });
};
