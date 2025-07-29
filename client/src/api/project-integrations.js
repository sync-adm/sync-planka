import socket from './socket';

/* Actions */

const createProjectIntegration = (projectId, data, headers) =>
  socket.post(`/projects/${projectId}/project-integrations`, data, headers);

const getProjectIntegrations = (projectId, headers) =>
  socket.get(`/projects/${projectId}/project-integrations`, undefined, headers);

const getProjectIntegration = (id, headers) =>
  socket.get(`/project-integrations/${id}`, undefined, headers);

const updateProjectIntegration = (id, data, headers) =>
  socket.patch(`/project-integrations/${id}`, data, headers);

const deleteProjectIntegration = (id, headers) =>
  socket.delete(`/project-integrations/${id}`, undefined, headers);

export default {
  createProjectIntegration,
  getProjectIntegrations,
  getProjectIntegration,
  updateProjectIntegration,
  deleteProjectIntegration,
};
