import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "../services/projectsApi";

export const useProjectDetails = (projectId) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId, // متعملش الريكويست لو الـ ID مش موجود
  });
};
