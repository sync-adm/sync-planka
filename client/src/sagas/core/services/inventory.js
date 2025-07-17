import { call, put, select } from 'redux-saga/effects';

import actions from '../../../actions';
import api from '../../../api';
import selectors from '../../../selectors';

export function* fetchInventory(subdomain) {
  yield put(actions.fetchInventory(subdomain));

  try {
    const accessToken = yield select(selectors.selectAccessToken);

    const response = yield call(api.getInventory, subdomain, {
      Authorization: `Bearer ${accessToken}`,
    });

    yield put(actions.fetchInventory.success(response));
  } catch (error) {
    yield put(actions.fetchInventory.failure(error));
  }
}

export default {
  fetchInventory,
};
