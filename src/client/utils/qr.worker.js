/* eslint-disable no-restricted-globals */
import jsQR from 'jsqr';
import getTimeStats from './getTimeStats';

self.addEventListener('message', event => {
  const { data, width, height } = event.data;
  const start = Date.now();
  const code = jsQR(data, width, height);
  const qrStats = getTimeStats('faceDetection', Date.now() - start);
  const debug = `${qrStats.time}ms ${qrStats.fps}fps`;

  self.postMessage({ debug, code });
});
