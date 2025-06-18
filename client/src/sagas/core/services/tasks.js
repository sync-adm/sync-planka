import { call, put, select } from 'redux-saga/effects';

import request from '../request';
import selectors from '../../../selectors';
import actions from '../../../actions';
import api from '../../../api';
import { createLocalId } from '../../../utils/local-id';

export function* createTask(taskListId, data) {
  const localId = yield call(createLocalId);

  const nextData = {
    ...data,
    position: yield select(selectors.selectNextTaskPosition, taskListId),
  };

  yield put(
    actions.createTask({
      ...nextData,
      taskListId,
      id: localId,
    }),
  );

  let task;
  try {
    ({ item: task } = yield call(request, api.createTask, taskListId, nextData));
  } catch (error) {
    yield put(actions.createTask.failure(localId, error));
    return;
  }

  yield put(actions.createTask.success(localId, task));
}

export function* handleTaskCreate(task) {
  yield put(actions.handleTaskCreate(task));
}

export function* updateTask(id, data) {
  yield put(actions.updateTask(id, data));

  let task;
  try {
    ({ item: task } = yield call(request, api.updateTask, id, data));
  } catch (error) {
    yield put(actions.updateTask.failure(id, error));
    return;
  }

  yield put(actions.updateTask.success(task));
}

export function* handleTaskUpdate(task) {
  yield put(actions.handleTaskUpdate(task));
}

export function* moveTask(id, taskListId, index) {
  const position = yield select(selectors.selectNextTaskPosition, taskListId, index, id);

  yield call(updateTask, id, {
    taskListId,
    position,
  });
}

export function* deleteTask(id) {
  yield put(actions.deleteTask(id));

  let task;
  try {
    ({ item: task } = yield call(request, api.deleteTask, id));
  } catch (error) {
    yield put(actions.deleteTask.failure(id, error));
    return;
  }

  yield put(actions.deleteTask.success(task));
}

export function* handleTaskDelete(task) {
  yield put(actions.handleTaskDelete(task));
}

export default {
  createTask,
  handleTaskCreate,
  updateTask,
  handleTaskUpdate,
  moveTask,
  deleteTask,
  handleTaskDelete,
};
