import api from "../../../services/api";

export const getAllProjects = async (queryString = "") => {
  const response = await api.get(`/projects?${queryString}`);
  return response.data;
};
export const getProjectById = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};
export const createProject = async (projectData) => {
  const response = await api.post("/projects", projectData);
  return response.data;
};
