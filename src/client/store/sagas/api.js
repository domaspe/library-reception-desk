import { takeLatest, takeLeading, call, put, all, select, delay } from 'redux-saga/effects';
import UIfx from 'uifx';

import assignAudio from '../../../../assets/assign.mp3';
import unassignAudio from '../../../../assets/unassign.mp3';
import * as actions from '../actions';
import { waitFor } from '../../utils/sagas';
import {
  selectIsFaceHistoryReady,
  selectFaceHistoryDescriptors,
  selectIsSessionPage
} from '../selectors';
import fetch from '../../utils/fetch';
import { mapFloat32ArrayToArr, mapArrToFloat32Array } from '../../utils/float32Array';

const assignFx = new UIfx(assignAudio, {
  volume: 0.4, // number between 0.0 ~ 1.0
  throttleMs: 100
});
const unassignFx = new UIfx(unassignAudio, {
  volume: 0.4, // number between 0.0 ~ 1.0
  throttleMs: 100
});

function* appInit() {
  yield all([put(actions.loadItems()), put(actions.loadUsers())]);
}

function* saveFace({ name, withFace }) {
  if (withFace) {
    yield call(waitFor, selectIsFaceHistoryReady);
    yield delay(1000);

    const descriptors = yield select(selectFaceHistoryDescriptors);

    yield put(actions.updateUser(name, descriptors));
    return;
  }

  yield put(actions.updateUser(name));
}

function* updateUser({ name, descriptors }) {
  console.debug(`Send "${name}"`);

  try {
    const users = yield call(fetch, '/api/users', 'POST', {
      name,
      descriptors: descriptors ? descriptors.map(mapFloat32ArrayToArr) : null
    });
    yield put(actions.updateUserSuccess(users));
    yield put(actions.loadUsers());
  } catch (err) {
    yield put(actions.updateUserFail());
  }
}

function* loadItems() {
  const items = yield call(fetch, '/api/items', 'GET');
  yield put(actions.loadItemsSuccess(items));
}

function* loadUsers() {
  const users = yield call(fetch, '/api/users', 'GET');

  yield put(
    actions.loadUsersSuccess(
      users.map(user => ({
        ...user,
        descriptors: user.descriptors ? user.descriptors.map(mapArrToFloat32Array) : null
      }))
    )
  );
}

function* tryAssignItem({ itemId, userId }) {
  yield put(actions.assignItemStarted());

  const clearResponse = yield call(fetch, '/api/items', 'POST', {
    id: itemId,
    userId
  });

  if (
    ['STATUS_ASSIGN_SUCCESS', 'STATUS_UNASSIGN_SUCCESS', 'STATUS_NOT_TAKEN'].indexOf(
      clearResponse.status
    ) >= 0
  ) {
    yield call(loadItems);
    yield put(actions.assignItemSuccess());

    if (clearResponse.status === 'STATUS_ASSIGN_SUCCESS') {
      yield call(assignFx.play);
    } else {
      yield call(unassignFx.play);
      const isSessionPage = yield select(selectIsSessionPage);
      if (clearResponse.status === 'STATUS_UNASSIGN_SUCCESS') {
        yield call(unassignFx.play);
        if (!isSessionPage) {
          yield put(actions.notify(`Item was sucessfuly returned`));
        }
      } else if (clearResponse.status === 'STATUS_NOT_TAKEN') {
        yield call(unassignFx.play);
        if (!isSessionPage) {
          yield put(actions.notify(`Item is not taken`));
        }
      }
    }
    return;
  }

  yield put(actions.assignItemFail());
}

function* loadStatistics() {
  const statistics = yield call(fetch, '/api/statistics', 'GET');

  yield put(
    actions.loadStatisticsSuccess(
      statistics.mostPopularItems.top,
      statistics.mostPopularItems.bot,
      statistics.mostActiveUsers.top
    )
  );
}

export default function* api() {
  yield all([
    yield takeLatest(actions.SAVE_FACE_START, saveFace),
    yield takeLatest(actions.UPDATE_USER, updateUser),
    yield takeLeading(actions.TRY_ASSIGN_ITEM, tryAssignItem),
    yield takeLatest(actions.APP_INIT, appInit),
    yield takeLatest(actions.LOAD_ITEMS, loadItems),
    yield takeLatest(actions.LOAD_USERS, loadUsers),
    yield takeLatest(actions.LOAD_STATISTICS, loadStatistics)
  ]);
}
