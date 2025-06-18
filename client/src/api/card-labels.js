import socket from './socket';

/* Actions */

const createCardLabel = (cardId, data, headers) =>
  socket.post(`/cards/${cardId}/card-labels`, data, headers);

const deleteCardLabel = (cardId, labelId, headers) =>
  socket.delete(`/cards/${cardId}/card-labels/labelId:${labelId}`, undefined, headers);

export default {
  createCardLabel,
  deleteCardLabel,
};
