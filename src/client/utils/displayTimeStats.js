import throttle from 'lodash.throttle';
import asciiSpinner from './asciiSpinner';

/* eslint-disable no-underscore-dangle */
const faceEl = document.getElementById('faceDebug');
const qrEl = document.getElementById('qrDebug');

const faceSpinner = asciiSpinner();
const qrSpinner = asciiSpinner();

const renewQrStatsThrottled = throttle(stats => {
  qrEl.innerHTML = `${qrSpinner()} qr detect: ${stats}`;
}, 500);

const renewFaceStatsThrottled = throttle(stats => {
  faceEl.innerHTML = `${faceSpinner()} Detect: ${stats.detect}; Match: ${stats.match}`;
}, 500);

export function __displayQrTimeStats(stats) {
  if (qrEl && stats) {
    renewQrStatsThrottled(stats);
  }
}

export function __displayFaceTimeStats(stats) {
  if (faceEl && stats) {
    // prettier-ignore
    renewFaceStatsThrottled(stats);
  }
}

/* eslint-enable */
