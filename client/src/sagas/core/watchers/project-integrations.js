import { all, takeEvery } from 'redux-saga/effects';

import services from '../services';
import EntryActionTypes from '../../../constants/EntryActionTypes';

export default function* projectIntegrationsWatchers() {
  yield all([
    takeEvery(EntryActionTypes.PROJECT_INTEGRATION_CREATE, ({ payload: { projectId, data } }) =>
      services.createProjectIntegration(projectId, data),
    ),
    takeEvery(EntryActionTypes.PROJECT_INTEGRATIONS_FETCH, ({ payload: { projectId } }) =>
      services.fetchProjectIntegrations(projectId),
    ),
    takeEvery(EntryActionTypes.PROJECT_INTEGRATION_UPDATE, ({ payload: { id, data } }) =>
      services.updateProjectIntegration(id, data),
    ),
    takeEvery(EntryActionTypes.PROJECT_INTEGRATION_DELETE, ({ payload: { id } }) =>
      services.deleteProjectIntegration(id),
    ),
    takeEvery(
      EntryActionTypes.PROJECT_INTEGRATION_CREATE_HANDLE,
      ({ payload: { projectIntegration } }) =>
        services.handleProjectIntegrationCreate(projectIntegration),
    ),
    takeEvery(
      EntryActionTypes.PROJECT_INTEGRATION_UPDATE_HANDLE,
      ({ payload: { projectIntegration } }) =>
        services.handleProjectIntegrationUpdate(projectIntegration),
    ),
    takeEvery(
      EntryActionTypes.PROJECT_INTEGRATION_DELETE_HANDLE,
      ({ payload: { projectIntegration } }) =>
        services.handleProjectIntegrationDelete(projectIntegration),
    ),
  ]);
}
