import { LOCATION_CHANGE } from 'connected-react-router';
import { eventChannel } from 'redux-saga';
import {
  all,
  call,
  cancel,
  delay,
  fork,
  put,
  race,
  select,
  take,
  takeLatest
} from 'redux-saga/effects';
// import UIfx from 'uifx';
// import loginAudio from '../../../../assets/login.mp3';
import {
  HIBERNATE_TIMEOUT,
  PATH_CREATE_USER,
  PATH_FACE_SCAN,
  PATH_HELP,
  PATH_NOTIFY,
  PATH_NOT_RECOGNIZED,
  PATH_SESSION,
  PATH_SLEEP,
  TIMEOUT_AFTER_ASSIGN,
  USERPICKER_TIMEOUT
} from '../../constants';
import history from '../../utils/history';
import * as actions from '../actions';
import {
  selectIsEnoughConsecutiveMatchSuccesses,
  selectIsFaceScanPage,
  selectIsFaceScanPagePaused,
  selectIsHelpPage,
  selectIsHibernatedPage,
  selectIsNotifyPage,
  selectIsNotRecognizedPage,
  selectIsSessionPage,
  selectIsCreateUserPage
} from '../selectors';

// const loginFx = new UIfx(loginAudio, {
//   volume: 0.3, // number between 0.0 ~ 1.0
//   throttleMs: 100
// });

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

const wheelChannel = eventChannel(emitter => {
  document.addEventListener('wheel', emitter);
  return () => {
    document.removeEventListener('wheel', emitter);
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
      take(wheelChannel),
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
  // yield call(loginFx.play);
  yield call(history.replace, PATH_SESSION);
}

function* endSession() {
  yield put(actions.clearActiveUser());
  yield put(actions.startScanningFaces());
}

function* startScanningFaces() {
  yield call(history.replace, PATH_FACE_SCAN);
}

function* faceMatchSuccess({ label }) {
  if (yield select(selectIsHibernatedPage)) {
    yield delay(500); // a little delay to show nabigation animation

    yield put(actions.startScanningFaces());
    return;
  }

  const enoughMatches = yield select(selectIsEnoughConsecutiveMatchSuccesses);
  if (!enoughMatches) {
    return;
  }

  const userId = Number(label);
  yield put(actions.startSession(userId));
}

function* faceNotRecognized() {
  yield call(history.replace, PATH_NOT_RECOGNIZED);
}

function* hibernate() {
  yield call(history.replace, PATH_SLEEP);
}

function* createUser() {
  yield call(history.replace, PATH_CREATE_USER);
}

function* help() {
  yield call(history.replace, PATH_HELP);
}

function* notify() {
  yield call(history.replace, PATH_NOTIFY);
}

function* endSessionOnEscape() {
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
      take(wheelChannel),
      take(clickChannel)
    ]);
    yield put(actions.startScanningFaces());
    return;
  }

  if (yield select(selectIsFaceScanPagePaused)) {
    yield call(waitForInactivity, USERPICKER_TIMEOUT, actions.startScanningFaces());
    return;
  }

  if (yield select(selectIsFaceScanPage)) {
    yield call(waitForInactivity, HIBERNATE_TIMEOUT, actions.hibernate());
    return;
  }

  if (yield select(selectIsNotRecognizedPage)) {
    yield call(waitForInactivity, HIBERNATE_TIMEOUT * 2, actions.startScanningFaces());
    return;
  }

  if (yield select(selectIsCreateUserPage)) {
    yield call(waitForInactivity, HIBERNATE_TIMEOUT * 3, actions.startScanningFaces());
    return;
  }

  if (yield select(selectIsSessionPage)) {
    yield race([
      call(waitForInactivity, HIBERNATE_TIMEOUT, actions.endSession()),
      call(endSessionOnEscape),
      take(actions.END_SESSION)
    ]);
    return;
  }

  if (yield select(selectIsHelpPage)) {
    yield call(waitForInactivity, HIBERNATE_TIMEOUT * 2, actions.startScanningFaces());
  }

  if (yield select(selectIsNotifyPage)) {
    yield delay(TIMEOUT_AFTER_ASSIGN);
    yield put(actions.startScanningFaces());
  }
}

export default function* navigation() {
  yield all([
    yield takeLatest(LOCATION_CHANGE, locationChange),
    yield takeLatest(actions.START_SESSION, startSession),
    yield takeLatest(actions.END_SESSION, endSession),
    yield takeLatest(actions.HIBERNATE, hibernate),
    yield takeLatest(actions.START_SCANNING_FACES, startScanningFaces),
    yield takeLatest(actions.LOAD_USERS_SUCCESS, startScanningFaces),
    yield takeLatest(actions.FACE_NOT_RECOGNIZED, faceNotRecognized),
    yield takeLatest(actions.UPDATE_USER_FAIL, faceNotRecognized),
    yield takeLatest(actions.CREATE_USER, createUser),
    yield takeLatest(actions.FACE_MATCH_SUCCESS, faceMatchSuccess),
    yield takeLatest(actions.HELP, help),
    yield takeLatest(actions.NOTIFY, notify)
  ]);
}
