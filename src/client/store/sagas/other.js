import {
  takeLatest,
  takeLeading,
  call,
  put,
  all,
  select,
  delay
} from 'redux-saga/effects';

import * as actions from '../actions';
import { waitFor } from '../../utils/sagas';
import {
  selectIsFaceHistoryReady,
  selectFaceHistoryDescriptors,
  selectFaceHistoryLabel,
  selectActiveUserId
} from '../selectors';
import fetch from '../../utils/fetch';
import { mapFloat32ArrayToArr } from '../../utils/float32Array';

function* appInit() {
  yield call(fetch, '/api/reload', 'GET');
  yield all([put(actions.loadItems()), put(actions.loadUsers())]);
}

function* saveFace() {
  yield call(waitFor, selectIsFaceHistoryReady);
  yield delay(1000);

  const descriptors = yield select(selectFaceHistoryDescriptors);
  const label = yield select(selectFaceHistoryLabel);

  yield put(actions.updateClass(label, descriptors));
}

function* saveFaceless(action) {
  console.debug(`Send "${action.user}"`);

  try {
    yield call(fetch, '/api/users', 'POST', { id: action.user });
    yield all([put(actions.loadUsers()) /* put(actions.setView(MAIN_VIEW)) */]);
  } catch (err) {
    yield put(actions.notify(`Failed to save user "${action.user}"`));
  }
}

function* updateClass({ label, descriptors }) {
  console.debug(`Send "${label}" with ${descriptors.length} descriptors`);

  try {
    yield call(fetch, '/api/classes', 'POST', {
      label,
      descriptors: descriptors.map(mapFloat32ArrayToArr)
    });
    yield put(actions.updateClassSuccess());
    yield put(actions.loadUsers());
    yield put(actions.startScanningFaces());
  } catch (err) {
    yield put(actions.updateClassFail());
    yield put(actions.notify(`Failed to save face of "${label}"`));
  }
}

function* loadItems() {
  const items = yield call(fetch, '/api/items', 'GET');
  yield put(actions.loadItemsSuccess(items));
}

function* loadUsers() {
  const users = yield call(fetch, '/api/users', 'GET');
  yield put(actions.loadUsersSuccess(users));
}

function* assignItemToUser(itemId, user) {
  const assignResponse = yield call(fetch, `/api/items/${itemId}`, 'POST', {
    user
  });

  if (!assignResponse.status || assignResponse.status === 'STATUS_FAIL') {
    yield put(actions.assignItemFail());
    return;
  }

  yield call(loadItems);
  yield put(actions.assignItemSuccess());
}

function* tryAssignItem({ itemId, userId }) {
  yield put(actions.assignItemStarted());

  const clearResponse = yield call(fetch, `/api/items/${itemId}`, 'POST', {
    user: userId
  });

  if (clearResponse.status === 'STATUS_SUCCESS') {
    yield call(loadItems);
    yield put(actions.assignItemSuccess());
    return;
  }

  yield put(actions.assignItemFail());
}

export default function* other() {
  yield all([
    yield takeLatest(actions.SAVE_FACE_START, saveFace),
    yield takeLatest(actions.SAVE_FACELESS, saveFaceless),
    yield takeLatest(actions.UPDATE_CLASS, updateClass),
    yield takeLeading(actions.TRY_ASSIGN_ITEM, tryAssignItem),
    yield takeLatest(actions.APP_INIT, appInit),
    yield takeLatest(actions.LOAD_ITEMS, loadItems),
    yield takeLatest(actions.LOAD_USERS, loadUsers)
  ]);
}
