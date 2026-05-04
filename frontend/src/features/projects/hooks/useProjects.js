import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "../services/projectsApi"; // الدالة اللي عملناها قبل كدة

export const useProjects = (queryString = "") => {
  return useQuery({
    // ضفنا الـ queryString للـ queryKey عشان لو عملنا فلتر بعدين، الـ Query يتحدث لوحده
    queryKey: ["projects", queryString],
    queryFn: () => getAllProjects(queryString),
  });
};
