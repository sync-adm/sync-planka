import { all, takeEvery } from 'redux-saga/effects';

import services from '../services';
import EntryActionTypes from '../../../constants/EntryActionTypes';

export default function* marketingWatchers() {
  yield all([
    takeEvery(EntryActionTypes.MARKETING_FETCH_COMPLETED_REQUESTS, ({ payload: { data } }) =>
      services.fetchMarketingCompletedRequests(data),
    ),
  ]);
}
