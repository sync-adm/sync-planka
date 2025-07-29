import { call, put, select } from 'redux-saga/effects';

import actions from '../../../actions';
import api from '../../../api';
import selectors from '../../../selectors';

export function* createProjectIntegration(projectId, data) {
  yield put(actions.createProjectIntegration(projectId, data));

  try {
    const accessToken = yield select(selectors.selectAccessToken);

    const response = yield call(api.createProjectIntegration, projectId, data, {
      Authorization: `Bearer ${accessToken}`,
    });

    yield put(actions.createProjectIntegration.success(response.item));
  } catch (error) {
    yield put(actions.createProjectIntegration.failure(error));
  }
}

export function* fetchProjectIntegrations(projectId) {
  yield put(actions.fetchProjectIntegrations(projectId));

  try {
    const accessToken = yield select(selectors.selectAccessToken);

    const response = yield call(api.getProjectIntegrations, projectId, {
      Authorization: `Bearer ${accessToken}`,
    });

    yield put(actions.fetchProjectIntegrations.success(response.items));
  } catch (error) {
    yield put(actions.fetchProjectIntegrations.failure(error));
  }
}

export function* updateProjectIntegration(id, data) {
  yield put(actions.updateProjectIntegration(id, data));

  try {
    const accessToken = yield select(selectors.selectAccessToken);

    const response = yield call(api.updateProjectIntegration, id, data, {
      Authorization: `Bearer ${accessToken}`,
    });

    yield put(actions.updateProjectIntegration.success(response.item));
  } catch (error) {
    yield put(actions.updateProjectIntegration.failure(error));
  }
}

export function* deleteProjectIntegration(id) {
  yield put(actions.deleteProjectIntegration(id));

  try {
    const accessToken = yield select(selectors.selectAccessToken);

    const response = yield call(api.deleteProjectIntegration, id, {
      Authorization: `Bearer ${accessToken}`,
    });

    yield put(actions.deleteProjectIntegration.success(response.item));
  } catch (error) {
    yield put(actions.deleteProjectIntegration.failure(error));
  }
}

export default {
  createProjectIntegration,
  fetchProjectIntegrations,
  updateProjectIntegration,
  deleteProjectIntegration,
};
