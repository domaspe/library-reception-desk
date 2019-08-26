import {
  takeLatest,
  call,
  put,
  all,
  select,
  race,
  delay,
  take,
  cancel,
  fork
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { LOCATION_CHANGE } from 'connected-react-router';

import * as actions from '../actions';
import {
  selectIsHibernatedPage,
  selectIsFaceScanPage,
  selectIsSessionPage,
  selectIsNotRecognizedPage,
  selectIsHelpPage,
  selectIsLogPage,
  selectActiveUserId
} from '../selectors';
import {
  HIBERNATE_TIMEOUT,
  PATH_FACE_SCAN,
  PATH_SESSION,
  PATH_SLEEP,
  PATH_NOT_RECOGNIZED,
  PATH_CREATE_USER,
  PATH_HELP,
  PATH_ITEM_LOG
} from '../../constants';
import history from '../../utils/history';

const keydownChannel = eventChannel(emitter => {
  document.addEventListener('keydown', emitter);
  return () => {
    document.removeEventListener('keydown', emitter);
  };
});

const mousemoveChannel = eventChannel(emitter => {
  document.addEventListener('mousemove', emitter);
  return () => {
    document.removeEventListener('mousemove', emitter);
  };
});

const clickChannel = eventChannel(emitter => {
  document.addEventListener('click', emitter);
  return () => {
    document.removeEventListener('click', emitter);
  };
});

function* waitForInactivity(timeout, action) {
  function* delayedWorker() {
    yield delay(timeout);
    yield put(action);
  }

  let task = yield fork(delayedWorker);
  while (true) {
    const [stopAction] = yield race([
      take(action.type),
      take('*'),
      take(keydownChannel),
      take(mousemoveChannel),
      take(clickChannel)
    ]);

    if (stopAction) {
      break;
    }

    if (task) {
      yield cancel(task);
    }

    task = yield fork(delayedWorker);
  }
}

function* startSession({ userId }) {
  yield put(actions.setActiveUser(userId));
  yield call(history.push, PATH_SESSION);
}

function* endSession() {
  yield put(actions.clearActiveUser());
  yield put(actions.startScanningFaces());
}

function* startScanningFaces() {
  yield call(history.push, PATH_FACE_SCAN);
}

function* faceMatchSuccess({ label }) {
  yield put(actions.startSession(label));
}

function* faceNotRecognized() {
  yield call(history.push, PATH_NOT_RECOGNIZED);
}

function* hibernate() {
  yield call(history.push, PATH_SLEEP);
}

function* createUser() {
  yield call(history.push, PATH_CREATE_USER);
}

function* help() {
  yield call(history.push, PATH_HELP);
}

function* itemLog() {
  yield call(history.push, PATH_ITEM_LOG);
}

function* navigateToWelcomeOnEscape() {
  while (true) {
    const event = yield take(keydownChannel);
    if (event.key === 'Escape') {
      yield put(actions.endSession());
      return;
    }
  }
}

function* locationChange() {
  if (yield select(selectIsHibernatedPage)) {
    yield race([
      take(keydownChannel),
      take(mousemoveChannel),
      take(clickChannel)
    ]);
    yield put(actions.startScanningFaces());
    return;
  }

  if (yield select(selectIsFaceScanPage)) {
    yield call(waitForInactivity, HIBERNATE_TIMEOUT, actions.hibernate());
    return;
  }

  if (yield select(selectIsNotRecognizedPage)) {
    yield call(
      waitForInactivity,
      HIBERNATE_TIMEOUT,
      actions.startScanningFaces()
    );
    return;
  }

  if (yield select(selectIsSessionPage)) {
    yield race([
      yield call(waitForInactivity, HIBERNATE_TIMEOUT, actions.endSession()),
      yield call(navigateToWelcomeOnEscape),
      yield take(actions.END_SESSION)
    ]);
    return;
  }

  if (yield select(selectIsHelpPage)) {
    yield call(
      waitForInactivity,
      HIBERNATE_TIMEOUT,
      actions.startScanningFaces()
    );
  }

  if (yield select(selectIsLogPage)) {
    const userId = yield select(selectActiveUserId);
    yield call(
      waitForInactivity,
      HIBERNATE_TIMEOUT,
      userId ? actions.startSession(userId) : actions.startScanningFaces()
    );
  }
}

export default function* navigation() {
  yield all([
    // TODO: temp
    // yield takeLatest(LOCATION_CHANGE, locationChange),
    yield takeLatest(actions.START_SESSION, startSession),
    yield takeLatest(actions.END_SESSION, endSession),
    yield takeLatest(actions.HIBERNATE, hibernate),
    yield takeLatest(actions.START_SCANNING_FACES, startScanningFaces),
    yield takeLatest(actions.FACE_NOT_RECOGNIZED, faceNotRecognized),
    yield takeLatest(actions.CREATE_USER, createUser),
    yield takeLatest(actions.FACE_MATCH_SUCCESS, faceMatchSuccess),
    yield takeLatest(actions.HELP, help),
    yield takeLatest(actions.ITEM_LOG, itemLog)
  ]);
}
