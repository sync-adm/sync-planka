import { call, put, select } from 'redux-saga/effects';

import actions from '../../../actions';
import api from '../../../api';
import selectors from '../../../selectors';

export function* fetchMarketingCompletedRequests(data) {
  yield put(actions.fetchCompletedRequests());

  try {
    const accessToken = yield select(selectors.selectAccessToken);

    const response = yield call(api.getCompletedRequests, data, {
      Authorization: `Bearer ${accessToken}`,
    });

    yield put(actions.fetchCompletedRequestsSuccess(response));
  } catch (error) {
    yield put(actions.fetchCompletedRequestsFailure(error));
  }
}

export default {
  fetchMarketingCompletedRequests,
};
