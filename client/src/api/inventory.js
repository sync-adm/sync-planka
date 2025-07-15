import socket from './socket';

/* Actions */

const getInventory = (subdomain, headers) =>
  socket.get(`/inventory/${subdomain}`, undefined, headers);

export default {
  getInventory,
};
