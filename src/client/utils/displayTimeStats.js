/* eslint-disable no-underscore-dangle */
const faceEl = document.getElementById('faceDebug');
const qrEl = document.getElementById('qrDebug');

export function __displayQrTimeStats(stats) {
  if (qrEl && stats) {
    // prettier-ignore
    qrEl.innerHTML = `qr detect: ${stats}`;
  }
}

export function __displayFaceTimeStats(stats) {
  if (faceEl && stats) {
    // prettier-ignore
    faceEl.innerHTML = `Detect: ${stats.detect}; Match: ${stats.match}`;
  }
}

/* eslint-enable */
