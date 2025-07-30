import { call, put, takeEvery } from 'redux-saga/effects';

import actions from '../actions';
import api from '../api';
import ActionTypes from '../constants/ActionTypes';

function* createProjectIntegrationWorker(action) {
  try {
    const { projectId, data } = action.payload;
    const projectIntegration = yield call(api.createProjectIntegration, projectId, data);

    yield put(actions.createProjectIntegration.success(projectIntegration));
  } catch (error) {
    const errorToDisplay =
      error?.responseJSON?.problems?.userFacing ||
      error?.responseJSON?.message ||
      error?.message ||
      'Error';
    yield put(actions.createProjectIntegration.failure(errorToDisplay));
  }
}

function* fetchProjectIntegrationsWorker(action) {
  try {
    const { projectId } = action.payload;
    const projectIntegrations = yield call(api.getProjectIntegrations, projectId);

    yield put(actions.fetchProjectIntegrations.success(projectIntegrations));
  } catch (error) {
    const errorToDisplay =
      error?.responseJSON?.problems?.userFacing ||
      error?.responseJSON?.message ||
      error?.message ||
      'Error';
    yield put(actions.fetchProjectIntegrations.failure(errorToDisplay));
  }
}

function* updateProjectIntegrationWorker(action) {
  try {
    const { id, data } = action.payload;
    const projectIntegration = yield call(api.updateProjectIntegration, id, data);

    yield put(actions.updateProjectIntegration.success(projectIntegration));
  } catch (error) {
    const errorToDisplay =
      error?.responseJSON?.problems?.userFacing ||
      error?.responseJSON?.message ||
      error?.message ||
      'Error';
    yield put(actions.updateProjectIntegration.failure(errorToDisplay));
  }
}

function* deleteProjectIntegrationWorker(action) {
  try {
    const { id } = action.payload;
    const projectIntegration = yield call(api.deleteProjectIntegration, id);

    yield put(actions.deleteProjectIntegration.success(projectIntegration));
  } catch (error) {
    const errorToDisplay =
      error?.responseJSON?.problems?.userFacing ||
      error?.responseJSON?.message ||
      error?.message ||
      'Error';
    yield put(actions.deleteProjectIntegration.failure(errorToDisplay));
  }
}

export default function* projectIntegrationsSaga() {
  yield takeEvery(ActionTypes.PROJECT_INTEGRATION_CREATE, createProjectIntegrationWorker);
  yield takeEvery(ActionTypes.PROJECT_INTEGRATIONS_FETCH, fetchProjectIntegrationsWorker);
  yield takeEvery(ActionTypes.PROJECT_INTEGRATION_UPDATE, updateProjectIntegrationWorker);
  yield takeEvery(ActionTypes.PROJECT_INTEGRATION_DELETE, deleteProjectIntegrationWorker);
}
