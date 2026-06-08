import { useSelector } from "react-redux"; // 🎯 اسحب اليوزر من الريدكس
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "../../projects/services/projectsApi";

export const useClientDashboard = () => {
  // 1. بدل ما ننادي getMe، هنجيب اليوزر الجاهز من Redux
  const { user: realUser } = useSelector((state) => state.auth);

  // 2. نجيب المشاريع
  const {
    data: projectsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects", ""],
    queryFn: () => getAllProjects(""),
    staleTime: 5 * 60 * 1000, // 🎯 خلي الداتا "طازة" لمدة 5 دقائق عشان ما يبعتش ريكويستات عمال على بطال
  });

  const allProjects = projectsData?.data?.projects || projectsData?.data || [];

  // فلترة المشاريع بناءً على اليوزر اللي في الريدكس
  const projects = allProjects.filter((project) => {
    const projectClientId = project.client?._id || project.client;
    return projectClientId === realUser?._id;
  });

  const stats = {
    total: projects.length,
    active: projects.filter(
      (p) => p.status === "open" || p.status === "in_progress",
    ).length,
    completed: projects.filter((p) => p.status === "completed").length,
    canceled: projects.filter((p) => p.status === "canceled").length,
  };

  return { projects, stats, isLoading, isError };
};
