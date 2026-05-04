import api from "../../../services/api";

export const createProposal = async ({ projectId, proposalData }) => {
  const response = await api.post(
    `/projects/${projectId}/proposals`,
    proposalData,
  );
  return response.data;
};

export const getProjectProposals = async (projectId) => {
  const response = await api.get(`/proposals/project/${projectId}`);
  return response.data;
};
