import socket from './socket';

/* Actions */

const createTaskList = (cardId, data, headers) =>
  socket.post(`/cards/${cardId}/task-lists`, data, headers);

const getTaskList = (id, headers) => socket.get(`/task-lists/${id}`, undefined, headers);

const updateTaskList = (id, data, headers) => socket.patch(`/task-lists/${id}`, data, headers);

const deleteTaskList = (id, headers) => socket.delete(`/task-lists/${id}`, undefined, headers);

export default {
  createTaskList,
  getTaskList,
  updateTaskList,
  deleteTaskList,
};
