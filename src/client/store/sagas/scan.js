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
  selectFaceCannotBeMatched,
  selectIsHibernatedPage,
  selectFaceMissingForHistory,
  selectActiveUserId
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

let faceScanPaused = false;
const FACE_SCAN_UNPAUSED = 'sagas/scan/FACE_SCAN_UNPAUSED';

function* scanFaceWorker() {
  let callNextDetectionFail = false;
  while (true) {
    if (faceScanPaused) {
      yield take(FACE_SCAN_UNPAUSED);
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

    if (isFaceMatched) {
      yield put(actions.faceMatchSuccess(result.match.label));
    } else if (isFaceDetected) {
      yield put(actions.faceMatchFail());
    }

    const faceCannotBeMatched = yield select(selectFaceCannotBeMatched);
    if (!isSavingFace && faceCannotBeMatched) {
      yield put(actions.faceNotRecognized());
    }

    const faceMissingForHistory = yield select(selectFaceMissingForHistory);
    if (isSavingFace && faceMissingForHistory) {
      yield put(actions.updateClassFail());
    }

    if (!faceScanPaused) {
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

function* faceScanRegulatorWorker() {
  while (true) {
    const [faceIsMatched, faceIsNotRecognized, navigatedToHelp] = yield race([
      take(actions.FACE_MATCH_SUCCESS),
      take(actions.FACE_NOT_RECOGNIZED),
      take(actions.HELP)
    ]);

    if (faceIsMatched) {
      faceScanPaused = true;
      yield take(actions.START_SCANNING_FACES);
      yield delay(FACE_SLOW_SCAN_INTERVAL * 3); // Also wait some time, so the same person is not logged in
    }

    if (faceIsNotRecognized) {
      faceScanPaused = true;
      yield race([
        take(actions.START_SCANNING_FACES),
        take(actions.SAVE_FACE_START)
      ]); // pause on not-recognised phase
      yield delay(FACE_SLOW_SCAN_INTERVAL);
    }

    if (navigatedToHelp) {
      faceScanPaused = true;
      yield take(actions.START_SCANNING_FACES);
      yield delay(FACE_SLOW_SCAN_INTERVAL);
    }

    faceScanPaused = false;
    yield put({ type: FACE_SCAN_UNPAUSED });
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
  yield all([yield takeLatest(actions.INITIALIZE_SCANNERS, startScan)]);
}
