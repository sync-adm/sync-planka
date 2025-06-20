import { call, put, select } from 'redux-saga/effects';

import actions from '../../../actions';
import api from '../../../api';
import selectors from '../../../selectors';

export function* fetchDesignNewRequests(data) {
  yield put(actions.fetchNewRequests());

  try {
    const accessToken = yield select(selectors.selectAccessToken);

    const response = yield call(api.getNewRequests, data, {
      Authorization: `Bearer ${accessToken}`,
    });

    yield put(actions.fetchNewRequestsSuccess(response));
  } catch (error) {
    yield put(actions.fetchNewRequestsFailure(error));
  }
}

export default {
  fetchDesignNewRequests,
};
