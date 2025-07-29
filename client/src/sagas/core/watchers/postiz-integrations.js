import { all, takeEvery } from 'redux-saga/effects';

import services from '../services';
import EntryActionTypes from '../../../constants/EntryActionTypes';

export default function* postizIntegrationsWatchers() {
  yield all([
    takeEvery(EntryActionTypes.POSTIZ_INTEGRATIONS_FETCH, ({ payload: { projectId } }) =>
      services.fetchPostizIntegrations(projectId),
    ),
  ]);
}
