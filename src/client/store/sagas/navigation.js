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
import UIfx from 'uifx';

import * as actions from '../actions';
import {
  selectIsHibernatedPage,
  selectIsFaceScanPage,
  selectIsSessionPage,
  selectIsNotRecognizedPage,
  selectIsHelpPage
} from '../selectors';
import {
  HIBERNATE_TIMEOUT,
  PATH_FACE_SCAN,
  PATH_SESSION,
  PATH_SLEEP,
  PATH_NOT_RECOGNIZED,
  PATH_CREATE_USER,
  PATH_HELP
} from '../../constants';
import history from '../../utils/history';
import loginAudio from '../../../../assets/login.mp3';

const loginFx = new UIfx(loginAudio, {
  volume: 0.4, // number between 0.0 ~ 1.0
  throttleMs: 100
});

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
  yield call(loginFx.play);
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
  if (yield select(selectIsHibernatedPage)) {
    yield delay(500); // a little delay to show nabigation animation
  }
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
      take(wheelChannel),
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
}

export default function* navigation() {
  yield all([
    yield takeLatest(LOCATION_CHANGE, locationChange),
    yield takeLatest(actions.START_SESSION, startSession),
    yield takeLatest(actions.END_SESSION, endSession),
    yield takeLatest(actions.HIBERNATE, hibernate),
    yield takeLatest(actions.START_SCANNING_FACES, startScanningFaces),
    yield takeLatest(actions.FACE_NOT_RECOGNIZED, faceNotRecognized),
    yield takeLatest(actions.CREATE_USER, createUser),
    yield takeLatest(actions.FACE_MATCH_SUCCESS, faceMatchSuccess),
    yield takeLatest(actions.HELP, help)
  ]);
}
