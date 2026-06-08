import { useQuery } from "@tanstack/react-query";
import { getFreelancers } from "../services/freelancersApi";

export const useFreelancers = (queryString = "") => {
  return useQuery({
    queryKey: ["freelancers", queryString],
    queryFn: () => getFreelancers(queryString),
  });
};
