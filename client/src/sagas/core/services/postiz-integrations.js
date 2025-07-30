import { call, put, select } from 'redux-saga/effects';

import actions from '../../../actions';
import api from '../../../api';
import selectors from '../../../selectors';

export function* fetchPostizIntegrations(projectId) {
  yield put(actions.fetchPostizIntegrations(projectId));

  try {
    const accessToken = yield select(selectors.selectAccessToken);

    const response = yield call(api.getPostizIntegrations, projectId, {
      Authorization: `Bearer ${accessToken}`,
    });

    yield put(actions.fetchPostizIntegrations.success(response));
  } catch (error) {
    yield put(actions.fetchPostizIntegrations.failure(error));
  }
}

export default {
  fetchPostizIntegrations,
};
