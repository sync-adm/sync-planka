import { call, put, select } from 'redux-saga/effects';
import toast from 'react-hot-toast';

import request from '../request';
import selectors from '../../../selectors';
import actions from '../../../actions';
import api from '../../../api';
import { createLocalId } from '../../../utils/local-id';
import ToastTypes from '../../../constants/ToastTypes';

export function* createList(boardId, data) {
  const localId = yield call(createLocalId);

  const nextData = {
    ...data,
    position: yield select(selectors.selectNextListPosition, boardId),
  };

  yield put(
    actions.createList({
      ...nextData,
      boardId,
      id: localId,
    }),
  );

  let list;
  try {
    ({ item: list } = yield call(request, api.createList, boardId, nextData));
  } catch (error) {
    yield put(actions.createList.failure(localId, error));
    return;
  }

  yield put(actions.createList.success(localId, list));
}

export function* createListInCurrentBoard(data) {
  const { boardId } = yield select(selectors.selectPath);

  yield call(createList, boardId, data);
}

export function* handleListCreate(list) {
  yield put(actions.handleListCreate(list));
}

export function* updateList(id, data) {
  yield put(actions.updateList(id, data));

  let list;
  try {
    ({ item: list } = yield call(request, api.updateList, id, data));
  } catch (error) {
    yield put(actions.updateList.failure(id, error));
    return;
  }

  yield put(actions.updateList.success(list));
}

export function* handleListUpdate(list) {
  yield put(actions.handleListUpdate(list));
}

export function* moveList(id, index) {
  const { boardId } = yield select(selectors.selectListById, id);
  const position = yield select(selectors.selectNextListPosition, boardId, index, id);

  yield call(updateList, id, {
    position,
  });
}

export function* sortList(id, data) {
  yield put(actions.sortList(id, data));

  let list;
  let cards;

  try {
    ({
      item: list,
      included: { cards },
    } = yield call(request, api.sortList, id, data));
  } catch (error) {
    yield put(actions.sortList.failure(id, error));
    return;
  }

  yield put(actions.sortList.success(list, cards));
}

export function* moveListCards(id, nextId) {
  const cardIds = yield select(selectors.selectCardIdsByListId, id);

  if (cardIds.length === 0) {
    return;
  }

  yield put(actions.moveListCards(id, nextId, cardIds));

  let list;
  let cards;
  let activities;

  try {
    ({
      item: list,
      included: { cards, activities },
    } = yield call(request, api.moveListCards, id, {
      listId: nextId,
    }));
  } catch (error) {
    yield put(actions.moveListCards.failure(id, error));
    return;
  }

  yield put(actions.moveListCards.success(list, cards, activities));
}

export function* moveListCardsToArchiveList(id) {
  const archiveListId = yield select(selectors.selectArchiveListIdForCurrentBoard);

  yield call(moveListCards, id, archiveListId);
}

export function* clearTrashListInCurrentBoard() {
  const trashListId = yield select(selectors.selectTrashListIdForCurrentBoard);

  yield put(actions.clearList(trashListId));

  yield call(toast, {
    type: ToastTypes.EMPTY_TRASH,
    params: {
      listId: trashListId,
    },
  });

  let list;
  try {
    ({ item: list } = yield call(request, api.clearList, trashListId));
  } catch (error) {
    yield put(actions.clearList.failure(trashListId, error));
    return;
  }

  yield put(actions.clearList.success(list));
}

export function* handleListClear(list) {
  yield put(actions.handleListClear(list));
}

export function* deleteList(id) {
  const trashListId = yield select(selectors.selectTrashListIdForCurrentBoard);
  const cardIds = yield select(selectors.selectCardIdsByListId, id);

  yield put(actions.deleteList(id, trashListId, cardIds));

  let list;
  let cards;

  try {
    ({
      item: list,
      included: { cards },
    } = yield call(request, api.deleteList, id));
  } catch (error) {
    yield put(actions.deleteList.failure(id, error));
    return;
  }

  yield put(actions.deleteList.success(list, cards));
}

export function* handleListDelete(list, cards) {
  yield put(actions.handleListDelete(list, cards));
}

export default {
  createList,
  createListInCurrentBoard,
  handleListCreate,
  updateList,
  handleListUpdate,
  moveList,
  sortList,
  moveListCardsToArchiveList,
  clearTrashListInCurrentBoard,
  handleListClear,
  deleteList,
  handleListDelete,
};
