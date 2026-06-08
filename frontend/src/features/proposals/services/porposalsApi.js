import api from "../../../services/api";

export const createProposal = async ({ projectId, proposalData }) => {
  const response = await api.post(
    `/projects/${projectId}/proposals`,
    proposalData,
  );
  return response.data;
};

export const getProjectProposals = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/proposals`);
  return response.data;
};

// قبول عرض
export const acceptProposal = async (proposalId) => {
  const response = await api.patch(`/proposals/${proposalId}/accept`);
  return response.data;
};

// بنفترض إن الباك إند عنده المسار ده
export const getMyProposals = async () => {
  const response = await api.get("/proposals/my-proposals");
  return response.data;
};

// رفض عرض
export const rejectProposal = async (proposalId) => {
  const response = await api.patch(`/proposals/${proposalId}/reject`);
  return response.data;
};
