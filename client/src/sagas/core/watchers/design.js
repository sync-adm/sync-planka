import { all, takeEvery } from 'redux-saga/effects';

import services from '../services';
import EntryActionTypes from '../../../constants/EntryActionTypes';

export default function* designWatchers() {
  yield all([
    takeEvery(EntryActionTypes.DESIGN_FETCH_NEW_REQUESTS, ({ payload: { data } }) =>
      services.fetchDesignNewRequests(data),
    ),
  ]);
}
