import socket from './socket';

const getPostizIntegrations = (projectId, headers) =>
  socket.get(`/projects/${projectId}/postiz/integrations`, undefined, headers);

export default {
  getPostizIntegrations,
};
