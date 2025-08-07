import { all, takeEvery } from 'redux-saga/effects';

import services from '../services';
import EntryActionTypes from '../../../constants/EntryActionTypes';

export default function* postizPostsWatchers() {
  yield all([
    takeEvery(EntryActionTypes.POSTIZ_POSTS_FETCH, ({ payload: { projectId, provider } }) =>
      services.fetchPostizPosts(projectId, provider),
    ),
  ]);
}
