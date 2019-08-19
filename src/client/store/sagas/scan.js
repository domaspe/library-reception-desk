import {
  takeLatest,
  call,
  put,
  all,
  select,
  race,
  delay,
  fork,
  take
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import * as actions from '../actions';
import { waitFor } from '../../utils/sagas';
import {
  selectIsFaceDetected,
  selectQrCode,
  selectIsSavingFace,
  selectIsFaceScanPage,
  selectIsSessionPage,
  selectAllFaceMatchAttemptsFailed,
  selectIsHibernatedPage
} from '../selectors';
import fetch from '../../utils/fetch';
import * as face from '../../utils/face';
import * as qr from '../../utils/qr';
import {
  FACE_SLOW_SCAN_INTERVAL,
  TIMEOUT_AFTER_ASSIGN,
  FACE_QUICK_SCAN_INTERVAL
} from '../../constants';
import { mapResponseToClass } from '../../utils/classUtils';
import QrWorker from '../../utils/qr.worker';
import {
  __displayFaceTimeStats,
  __displayQrTimeStats
} from '../../utils/displayTimeStats';

const animationFrame = () =>
  new Promise(resolve => requestAnimationFrame(resolve));

let scanPaused = false;
const SCAN_UNPAUSED = 'sagas/scan/SCAN_UNPAUSED';

function* scanFaceWorker() {
  let callNextDetectionFail = false;
  // let callNextMatchFail = true;
  while (true) {
    if (scanPaused) {
      yield take(SCAN_UNPAUSED);
    }

    const isSavingFace = yield select(selectIsSavingFace);
    const isFaceDetectionNotified = yield select(selectIsFaceDetected);
    const result = yield call(face.scan);

    __displayFaceTimeStats(result && result.debug);

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

    // const matchFailRecorded = yield select(selectIsFaceMatchFailed);
    if (isFaceMatched) {
      // callNextMatchFail = true;
      yield put(actions.faceMatchSuccess(result.match.label));
    } else if (isFaceDetected) {
      // callNextMatchFail = false;
      yield put(actions.faceMatchFail());
    }

    const matchAttemptsFailed = yield select(selectAllFaceMatchAttemptsFailed);
    if (!isSavingFace && matchAttemptsFailed) {
      yield put(actions.faceNotRecognized());
    }

    if (yield select(selectIsFaceScanPage)) {
      yield delay(FACE_QUICK_SCAN_INTERVAL);
    } else if (yield select(selectIsHibernatedPage)) {
      yield race([
        delay(FACE_SLOW_SCAN_INTERVAL),
        call(waitFor, selectIsFaceScanPage)
      ]);
    } else {
      yield delay(FACE_SLOW_SCAN_INTERVAL);
    }
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
          yield put(actions.tryAssignItem(code.data));
          yield delay(TIMEOUT_AFTER_ASSIGN);
        }
      } else if (callNextFail) {
        callNextFail = false;
        yield put(actions.qrDetectFail());
      }
    }

    // const isSavingFace = yield select(selectIsSavingFace);
    // const isFaceDetected = yield select(selectIsFaceDetected);
    // if (isSavingFace) {
    //   yield call(waitFor, selectIsSavingFace, false);
    // } else if (isFaceDetected) {
    //   yield call(animationFrame);
    // } else {
    //   yield call(waitFor, selectIsFaceDetected);
    // }

    if (yield select(selectIsSessionPage)) {
      yield call(animationFrame);
    } else {
      yield call(waitFor, selectIsSessionPage);
    }
  }
}

function* faceScanRegulatorWorker() {
  while (true) {
    const [faceIsMatched, faceIsNotRecognized, navigatedToHelp] = yield race([
      take(actions.FACE_MATCH_SUCCESS),
      take(actions.FACE_NOT_RECOGNIZED),
      take(actions.HELP)
    ]);

    if (faceIsMatched) {
      scanPaused = true;
      yield take(actions.START_SCANNING_FACES);
      yield delay(FACE_SLOW_SCAN_INTERVAL * 3); // Also wait some time, so the same person is not logged in
    }

    if (faceIsNotRecognized) {
      scanPaused = true;
      yield race([
        take(actions.START_SCANNING_FACES),
        take(actions.SAVE_FACE_START)
      ]); // pause on not-recognised phase
      yield delay(FACE_SLOW_SCAN_INTERVAL);
    }

    if (navigatedToHelp) {
      scanPaused = true;
      yield take(actions.START_SCANNING_FACES);
      yield delay(FACE_SLOW_SCAN_INTERVAL);
    }

    scanPaused = false;
    yield put({ type: SCAN_UNPAUSED });
  }
}

function* startScan(action) {
  if (!face.isFaceDetectionModelLoaded()) {
    yield call(face.loadModels);
  }
  const classesResponse = yield call(fetch, '/api/classes');
  const classes = classesResponse.map(mapResponseToClass);
  yield call(face.createFaceMatcher, classes);

  if (action.type === actions.INITIALIZE_SCANNERS) {
    face.setMedia(action.videoRef.current, action.faceCanvasRef.current);
    qr.setMedia(action.videoRef.current, action.qrCanvasRef.current);
  }

  yield fork(scanFaceWorker);
  yield fork(scanQrWorker);
  yield fork(faceScanRegulatorWorker);
}

export default function* sagas() {
  yield all([
    yield takeLatest(actions.UPDATE_CLASS_SUCCESS, startScan),
    yield takeLatest(actions.INITIALIZE_SCANNERS, startScan)
  ]);
}
