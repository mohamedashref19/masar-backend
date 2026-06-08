import api from "../../../services/api";

export const getAllProjects = async (queryString = "") => {
  const response = await api.get(`/projects?${queryString}`);
  return response.data;
};
export const getProjectById = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};
export const getMyProjects = async () => {
  const response = await api.get("/projects/my-projects");
  return response.data;
};
export const createProject = async (projectData) => {
  const response = await api.post("/projects", projectData);
  return response.data;
};

export const completeProject = async (projectId) => {
  const response = await api.patch(`/projects/${projectId}/complete`);
  return response.data;
};

export const cancelProject = async (projectId) => {
  const response = await api.patch(`/projects/${projectId}/cancel`);
  return response.data;
};
// دالة حذف المشروع
export const deleteProject = async (projectId) => {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
};

// دالة تعديل المشروع
export const updateProject = async ({ id, projectData }) => {
  const response = await api.patch(`/projects/${id}`, projectData);
  return response.data;
};
