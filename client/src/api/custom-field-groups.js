import socket from './socket';

/* Actions */

const createCustomFieldGroupInBoard = (cardId, data, headers) =>
  socket.post(`/boards/${cardId}/custom-field-groups`, data, headers);

const createCustomFieldGroupInCard = (cardId, data, headers) =>
  socket.post(`/cards/${cardId}/custom-field-groups`, data, headers);

const getCustomFieldGroup = (id, headers) =>
  socket.get(`/custom-field-groups/${id}`, undefined, headers);

const updateCustomFieldGroup = (id, data, headers) =>
  socket.patch(`/custom-field-groups/${id}`, data, headers);

const deleteCustomFieldGroup = (id, headers) =>
  socket.delete(`/custom-field-groups/${id}`, undefined, headers);

export default {
  createCustomFieldGroupInBoard,
  createCustomFieldGroupInCard,
  getCustomFieldGroup,
  updateCustomFieldGroup,
  deleteCustomFieldGroup,
};
