import { all, takeEvery } from 'redux-saga/effects';

import services from '../services';
import EntryActionTypes from '../../../constants/EntryActionTypes';

export default function* inventoryWatchers() {
  yield all([
    takeEvery(EntryActionTypes.INVENTORY_FETCH, ({ payload: { subdomain } }) =>
      services.fetchInventory(subdomain),
    ),
  ]);
}
