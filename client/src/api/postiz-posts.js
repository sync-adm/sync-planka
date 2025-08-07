import socket from './socket';

const getPostizPosts = (projectId, provider, headers) =>
  socket.get(`/projects/${projectId}/postiz/posts/${provider}`, undefined, headers);

export default {
  getPostizPosts,
};
