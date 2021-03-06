import * as faceapi from 'face-api.js';
import { matchDimensions } from './video';
import getTimeStats from './getTimeStats';

const SSD_MOBILENETV1 = 'ssd_mobilenetv1';
const TINY_FACE_DETECTOR = 'tiny_face_detector';
// eslint-disable-next-line no-unused-vars
const MTCNN = 'mtcnn';

const selectedFaceDetector = SSD_MOBILENETV1;
const faceDetectionNet = faceapi.nets.tinyFaceDetector;

// SsdMobilenetv1Options
const minConfidence = 0.9;
const maxResults = 1;
const distanceThreshold = 0.45;

// TinyFaceDetectorOptions
const inputSize = 512; // divisible by 32
const scoreThreshold = 0.5;

// MtcnnOptions
const minFaceSize = 20;

function getFaceDetectorOptions() {
  if (selectedFaceDetector === SSD_MOBILENETV1) {
    return new faceapi.SsdMobilenetv1Options({ minConfidence, maxResults });
  }

  if (selectedFaceDetector === TINY_FACE_DETECTOR) {
    return new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
  }

  return new faceapi.MtcnnOptions({ minFaceSize });
}

export async function loadModels() {
  faceDetectionNet.loadFromUri('/weights');
  faceapi.nets.faceLandmark68Net.loadFromUri('/weights');
  faceapi.nets.faceRecognitionNet.loadFromUri('/weights');
  faceapi.nets.ssdMobilenetv1.loadFromUri('/weights');
}

export function isFaceDetectionModelLoaded() {
  return (
    !!faceDetectionNet.params &&
    !!faceapi.nets.faceLandmark68Net.params &&
    !!faceapi.nets.faceRecognitionNet.params &&
    !!faceapi.nets.ssdMobilenetv1.params
  );
}

let faceMatcher = null;
let video;
let canvas;

async function detectSingleFace(videoEl, canvasEl) {
  if (!isFaceDetectionModelLoaded()) {
    return null;
  }

  const options = getFaceDetectorOptions();
  const result = await faceapi
    .detectSingleFace(videoEl, options)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!result) {
    const context = canvasEl.getContext('2d');
    context.clearRect(0, 0, canvasEl.width, canvasEl.height);
    return null;
  }

  return result;
}

function drawDetection(canvasEl, videoEl, result) {
  try {
    const dims = matchDimensions(canvasEl, videoEl);
    const resizedDetections = faceapi.resizeResults(result, dims);
    new faceapi.draw.DrawBox(resizedDetections.detection.box, {
      lineWidth: 2
    }).draw(canvasEl);

    // faceapi.draw.drawFaceLandmarks(canvasEl, resizedDetections);
    // eslint-disable-next-line no-empty
  } catch (err) {}
}

function findMatchingFace(descriptor) {
  try {
    const result = faceMatcher && faceMatcher.findBestMatch(descriptor, distanceThreshold);
    if (result && result.label !== 'unknown') {
      return result;
    }
    // eslint-disable-next-line no-empty
  } catch (err) {}

  return null;
}

export function setMedia(videoEl, canvasEl) {
  video = videoEl;
  canvas = canvasEl;
}

export async function createFaceMatcher(classes) {
  const labeledFaceDescriptors = classes.map(clazz => {
    return new faceapi.LabeledFaceDescriptors(clazz.label, clazz.descriptors);
  });

  if (labeledFaceDescriptors.length > 0) {
    const ts = Date.now();
    faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
    console.log(
      `created faceMatcher from total of ${
        labeledFaceDescriptors.length
      } labeled descriptors. Took: ${Date.now() - ts}ms`
    );
  }
}

let backend = null;
export async function scan() {
  if (video.paused || video.ended) {
    return null;
  }

  if (!backend) {
    backend = faceapi.tf.getBackend();
    if (backend) console.log('Tf backend', backend);
  }

  const debug = {};
  const detectStart = Date.now();
  const detection = await detectSingleFace(video, canvas);

  const detectStats = getTimeStats('faceDetection', Date.now() - detectStart);
  debug.detect = `${detectStats.time}ms ${detectStats.fps}hz`;

  let match = null;
  if (detection) {
    debug.detect += `(${detection.detection.score.toPrecision(2)})`;

    const matchStart = Date.now();
    match = findMatchingFace(detection.descriptor);
    debug.match = '';
    if (match) {
      const matchStats = getTimeStats('faceMatch', Date.now() - matchStart);
      debug.match = `${matchStats.time}ms ${matchStats.fps}fps; ${match.toString()}`;
    }
    drawDetection(canvas, video, detection);
  }

  return {
    detection,
    match,
    debug
  };
}
