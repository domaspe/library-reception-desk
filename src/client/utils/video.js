import * as faceapi from 'face-api.js';

export function matchDimensions(canvasEl, videoEl, useMediaDimensions) {
  return faceapi.matchDimensions(canvasEl, videoEl, useMediaDimensions);
}
