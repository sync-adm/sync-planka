import { call, put, select } from 'redux-saga/effects';

import actions from '../../../actions';
import api from '../../../api';
import selectors from '../../../selectors';

export function* fetchPostizPosts(projectId, provider) {
  yield put(actions.fetchPostizPosts(projectId, provider));

  try {
    const accessToken = yield select(selectors.selectAccessToken);

    const response = yield call(api.getPostizPosts, projectId, provider, {
      Authorization: `Bearer ${accessToken}`,
    });

    yield put(actions.fetchPostizPosts.success(response));
  } catch (error) {
    yield put(actions.fetchPostizPosts.failure(error));
  }
}

export default {
  fetchPostizPosts,
};
