import {
  takeLatest,
  call,
  put,
  all,
  select,
  race,
  delay,
  fork,
  take,
  cancel
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import moment from 'moment';

import * as actions from '../actions';
import { waitFor } from '../../utils/sagas';
import {
  selectIsFaceDetected,
  selectQrCode,
  selectIsFaceScanPage,
  selectIsSessionPage,
  selectFaceCannotBeMatched,
  selectIsHibernatedPage,
  selectFaceMissingForHistory,
  selectActiveUserId,
  selectIsHelpPage,
  selectIsCreateUserPage,
  selectIsReadingFace,
  selectClasses
} from '../selectors';

import * as face from '../../utils/face';
import * as qr from '../../utils/qr';
import {
  FACE_SLOW_SCAN_INTERVAL,
  TIMEOUT_AFTER_ASSIGN,
  FACE_QUICK_SCAN_INTERVAL,
  FACE_SCAN_TASK_INTERVAL,
  PATH_CREATE_USER,
  PATH_SESSION,
  FACE_DELAY_BEFORE_SCAN_INTERVAL,
  PATH_FACE_SCAN,
  FACE_READ_FACE_SCAN_INTERVAL,
  PATH_HELP
} from '../../constants';
import QrWorker from '../../utils/qr.worker';
import {
  __displayFaceTimeStats,
  __displayQrTimeStats
} from '../../utils/displayTimeStats';

const moduleCreateTime = moment();
const animationFrame = () =>
  new Promise(resolve => requestAnimationFrame(resolve));

let callNextDetectionFail = false;
function* performFaceScan() {
  const isReadingFace = yield select(selectIsReadingFace);
  const isFaceDetectionNotified = yield select(selectIsFaceDetected);
  const result = yield call(face.scan);

  __displayFaceTimeStats(result && result.debug);

  const isFaceDetected = result && result.detection;
  const isFaceMatched = result && result.match;

  if (isFaceDetected) {
    const shouldNotifyDetection = isReadingFace || !isFaceDetectionNotified;
    if (shouldNotifyDetection) {
      yield put(actions.faceDetectSuccess(result.detection.descriptor));
    }
    callNextDetectionFail = true;
  } else if (callNextDetectionFail || isReadingFace) {
    // Dispatch only one consecutive fail action unless we are reading face for new user, then always dispatch fail
    yield put(actions.faceDetectFail());
    callNextDetectionFail = false;
  }

  if (!isReadingFace && isFaceMatched) {
    // Check if we are still in face scan page.
    // This prevents race condition, when user clicks on some other page, but we still redirect him to session
    if (yield select(selectIsFaceScanPage)) {
      yield put(actions.faceMatchSuccess(result.match.label));
    }
  }

  if (!isReadingFace && !isFaceMatched && isFaceDetected) {
    yield put(actions.faceMatchFail());
  }

  if (!isReadingFace) {
    const faceCannotBeMatched = yield select(selectFaceCannotBeMatched);
    if (faceCannotBeMatched) {
      yield put(actions.faceNotRecognized());
    }
  }

  if (isReadingFace) {
    const faceMissingForHistory = yield select(selectFaceMissingForHistory);
    if (faceMissingForHistory) {
      yield put(actions.updateUserFail());
    }
  }
}

function* scanFaceWorker() {
  let task = null;
  let lastState = '';
  let delayNextIteration = 0;
  let cancelCurrentScan = true;
  while (true) {
    delayNextIteration = 0;
    cancelCurrentScan = true;

    if (yield select(selectIsCreateUserPage)) {
      if (yield select(selectIsReadingFace)) {
        delayNextIteration = FACE_READ_FACE_SCAN_INTERVAL;
        cancelCurrentScan = false;
      }
      lastState = PATH_CREATE_USER;
    } else if (yield select(selectIsSessionPage)) {
      lastState = PATH_SESSION;
    } else if (yield select(selectIsHelpPage)) {
      lastState = PATH_HELP;
    } else if (yield select(selectIsFaceScanPage)) {
      cancelCurrentScan = lastState !== PATH_FACE_SCAN;
      delayNextIteration = cancelCurrentScan
        ? FACE_DELAY_BEFORE_SCAN_INTERVAL
        : FACE_QUICK_SCAN_INTERVAL;
      lastState = PATH_FACE_SCAN;
    } else if (yield select(selectIsHibernatedPage)) {
      if (moment().diff(moduleCreateTime, 'hours') > 1) {
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      }

      cancelCurrentScan = false;
      delayNextIteration = FACE_SLOW_SCAN_INTERVAL;
    }

    if (cancelCurrentScan) {
      if (task && task.isRunning()) {
        yield cancel(task);
      }
    } else if (!task || !task.isRunning()) {
      task = yield fork(performFaceScan);
    }
    yield delay(delayNextIteration || FACE_SCAN_TASK_INTERVAL);
  }
}

function* scanQrWorker() {
  let callNextFail = false;
  const qrWorker = new QrWorker();
  const workerMessageChannel = eventChannel(emitter => {
    qrWorker.addEventListener('message', emitter);
    return () => {
      qrWorker.removeEventListener('message', emitter);
    };
  });

  while (true) {
    const workerData = qr.getWorkerData();

    if (workerData) {
      qrWorker.postMessage(workerData);
      const event = yield take(workerMessageChannel);
      const { code, debug } = event.data;

      __displayQrTimeStats(debug);

      qr.drawCode(code);
      if (code && code.data) {
        const prevCode = yield select(selectQrCode);
        if (code.data !== prevCode) {
          callNextFail = true;
          yield put(actions.qrDetectSuccess(code.data));
          const userId = yield select(selectActiveUserId);
          yield put(actions.tryAssignItem(code.data, userId));
          yield delay(TIMEOUT_AFTER_ASSIGN);
        }
      } else if (callNextFail) {
        callNextFail = false;
        yield put(actions.qrDetectFail());
      }
    }

    const isSessionPage = yield select(selectIsSessionPage);
    const isFaceScanPage = yield select(selectIsFaceScanPage);
    if (isSessionPage || isFaceScanPage) {
      yield call(animationFrame);
    } else {
      yield race([
        call(waitFor, selectIsSessionPage),
        call(waitFor, selectIsFaceScanPage)
      ]);
    }
  }
}

function* createFaceMatcher() {
  const classes = yield select(selectClasses);
  yield call(face.createFaceMatcher, classes);
}

function* startScan(action) {
  if (!face.isFaceDetectionModelLoaded()) {
    yield call(face.loadModels);
  }

  face.setMedia(action.videoRef.current, action.faceCanvasRef.current);
  qr.setMedia(action.videoRef.current, action.qrCanvasRef.current);

  yield fork(scanFaceWorker);
  yield fork(scanQrWorker);
}

export default function* sagas() {
  yield all([
    yield takeLatest(actions.INITIALIZE_SCANNERS, startScan),
    yield takeLatest(actions.LOAD_USERS_SUCCESS, createFaceMatcher)
  ]);
}
