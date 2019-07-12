import {
  takeLatest,
  takeLeading,
  call,
  put,
  all,
  select,
  race,
  delay,
  take
} from 'redux-saga/effects';
import * as actions from './actions';
import { waitFor } from '../utils/sagas';
import {
  selectIsFaceHistoryReady,
  selectFaceHistoryDescriptors,
  selectFaceHistoryLabel,
  selectFaceMatchLabel,
  selectIsFaceDetected,
  selectQrCode,
  selectIsSavingFace,
  selectIsUserPickerOpen,
  selectUsers,
  selectItemByCode,
  selectItemLabelByCode
} from './selectors';
import fetch from '../utils/fetch';
import * as face from '../utils/face';
import * as qr from '../utils/qr';
import {
  MAIN_VIEW,
  FACE_SCAN_INTERVAL,
  QR_SCAN_INTERVAL,
  TIMEOUT_AFTER_ASSIGN,
  FACE_QUICK_SCAN_INTERVAL,
  QR_QUICK_SCAN_INTERVAL
} from '../constants';
import { mapFloat32ArrayToArr } from '../utils/float32Array';
import { mapResponseToClass } from '../utils/classUtils';

/* eslint-disable no-underscore-dangle */
const __faceDebugEl__ = document.getElementById('faceDebug');
const __qrDebugEl__ = document.getElementById('qrDebug');
/* eslint-enable */

function* appInit() {
  yield all([put(actions.loadItems()), put(actions.loadUsers())]);
}

function* saveFace() {
  yield call(waitFor, selectIsFaceHistoryReady);

  const descriptors = yield select(selectFaceHistoryDescriptors);
  const label = yield select(selectFaceHistoryLabel);

  yield put(actions.updateClass(label, descriptors));
}

function* saveFaceless(action) {
  console.debug(`Send "${action.user}"`);

  try {
    yield call(fetch, '/api/users', 'POST', { id: action.user });
    yield all([put(actions.loadUsers()), put(actions.setView(MAIN_VIEW))]);
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
    yield all([put(actions.loadUsers()), put(actions.setView(MAIN_VIEW))]);
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

function* successAssignItemWithTimeout() {
  yield all([call(loadItems), delay(TIMEOUT_AFTER_ASSIGN)]);
  yield put(actions.assignItemSuccess());
}

function* failAssignItemWithTimeout() {
  yield delay(TIMEOUT_AFTER_ASSIGN);
  yield put(actions.assignItemFail());
}

function* assignCodeToUser(code, user) {
  const assignResponse = yield call(fetch, '/api/items', 'POST', { id: code, user });
  const item = yield select(selectItemLabelByCode, code);

  if (!assignResponse.status || assignResponse.status === 'STATUS_FAIL') {
    yield put(actions.notify(`Failed to assign ${item} to ${user}`));
    yield call(failAssignItemWithTimeout);
    return;
  }

  yield put(actions.notify(`${item} was assigned to ${user}`));
  yield call(successAssignItemWithTimeout);
}

function* assignItemToUserFromPicker(code) {
  const users = yield select(selectUsers);
  if (!users.length) {
    yield put(actions.assignItemFail());
    return;
  }

  const item = yield select(selectItemByCode, code);

  if (!item) {
    yield put(actions.assignItemFail());
    return;
  }

  yield put(actions.openUserPicker(code));
  const { userAction } = yield race({
    userAction: take(actions.PICK_USER),
    cancel: take(actions.CLOSE_USER_PICKER)
  });

  if (!userAction) {
    yield put(actions.assignItemFail());
    return;
  }

  yield put(actions.closeUserPicker());
  yield call(assignCodeToUser, code, userAction.user);
}

function* tryAssignItem({ code }) {
  const codeInt = parseInt(code, 10);
  if (!codeInt) {
    yield call(failAssignItemWithTimeout);
    return;
  }
  yield put(actions.assignItemStarted());

  const clearResponse = yield call(fetch, '/api/items', 'DELETE', { id: codeInt });
  if (clearResponse.status === 'STATUS_SUCCESS') {
    const item = yield select(selectItemLabelByCode, codeInt);
    yield put(actions.notify(`${item} was returned`));
    yield call(successAssignItemWithTimeout);
    return;
  }

  yield race([call(waitFor, selectFaceMatchLabel), delay(1000)]);

  const faceLabel = yield select(selectFaceMatchLabel);
  if (!faceLabel) {
    yield call(assignItemToUserFromPicker, codeInt);
    return;
  }

  yield call(assignCodeToUser, codeInt, faceLabel);
}

function* waitIfUserPickerOpen() {
  const isUserPickerOpen = yield select(selectIsUserPickerOpen);
  if (isUserPickerOpen) {
    yield take(actions.CLOSE_USER_PICKER);
  }
}

function* scanFaceLoop() {
  let callNextDetectionFail = false;
  let callNextMatchFail = false;
  while (true) {
    yield call(waitIfUserPickerOpen);

    const isSavingFace = yield select(selectIsSavingFace);
    const isFaceDetectionNotified = yield select(selectIsFaceDetected);
    const result = yield call(face.scan);

    if (__faceDebugEl__ && result) {
      // prettier-ignore
      __faceDebugEl__.innerHTML = `face detect: ${result.debug.detect}; match: ${result.debug.match}`;
    }

    const isFaceDetected = result && result.detection;
    const isFaceMatched = result && result.match;

    if (isFaceDetected) {
      const shouldNotifyDetection = isSavingFace || !isFaceDetectionNotified;
      if (shouldNotifyDetection) {
        yield put(actions.faceDetectSuccess(result.detection.descriptor));
      }
      callNextDetectionFail = true;
    } else if (callNextDetectionFail) {
      // dispatch only one consecutive fail action
      yield put(actions.faceDetectFail());
      callNextDetectionFail = false;
    }

    if (isFaceMatched) {
      const prevMatchLabel = yield select(selectFaceMatchLabel);
      if (result.match.label !== prevMatchLabel) {
        callNextMatchFail = true;
        yield put(actions.faceMatchSuccess(result.match.label));
      }
    } else if (callNextMatchFail) {
      callNextMatchFail = false;
      yield put(actions.faceMatchFail());
    }

    yield delay(
      isFaceDetectionNotified && !isSavingFace ? FACE_QUICK_SCAN_INTERVAL : FACE_SCAN_INTERVAL
    );
  }
}

function* scanQrLoop() {
  let callNextFail = false;
  while (true) {
    yield call(waitIfUserPickerOpen);

    const result = yield call(qr.scan);

    if (__qrDebugEl__ && result) {
      // prettier-ignore
      __qrDebugEl__.innerHTML = `qr: ${result.debug}`;
    }

    if (result && result.data) {
      const prevCode = yield select(selectQrCode);
      if (result.data !== prevCode) {
        callNextFail = true;
        yield put(actions.qrDetectSuccess(result.data));
      }
    } else if (callNextFail) {
      callNextFail = false;
      yield put(actions.qrDetectFail());
    }

    const isSavingFace = yield select(selectIsSavingFace);
    const isFaceDetectionNotified = yield select(selectIsFaceDetected);
    yield delay(
      isFaceDetectionNotified && !isSavingFace ? QR_QUICK_SCAN_INTERVAL : QR_SCAN_INTERVAL
    );
  }
}

function* startScan(action) {
  if (!face.isFaceDetectionModelLoaded()) {
    yield call(face.loadModels);
  }
  const classesResponse = yield call(fetch, '/api/classes');
  const classes = classesResponse.map(mapResponseToClass);
  yield call(face.createFaceMatcher, classes);

  if (action.type === actions.SCAN_START) {
    face.setMedia(
      action.videoRef.current,
      action.faceCanvasRef.current,
      action.mediaWidth,
      action.mediaHeight
    );
    qr.setMedia(action.videoRef.current, action.qrCanvasRef.current);
  }

  yield all([call(scanFaceLoop), call(scanQrLoop)]);
}

export default function* sagas() {
  yield all([
    yield takeLatest(actions.UPDATE_CLASS_SUCCESS, startScan),
    yield takeLatest(actions.SAVE_FACE_START, saveFace),
    yield takeLatest(actions.SAVE_FACELESS, saveFaceless),
    yield takeLatest(actions.UPDATE_CLASS, updateClass),
    yield takeLeading(actions.QR_DETECT_SUCCESS, tryAssignItem),
    yield takeLatest(actions.SCAN_START, startScan),
    yield takeLatest(actions.APP_INIT, appInit),
    yield takeLatest(actions.LOAD_ITEMS, loadItems),
    yield takeLatest(actions.LOAD_USERS, loadUsers)
  ]);
}
