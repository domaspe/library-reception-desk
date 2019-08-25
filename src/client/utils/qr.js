import * as videoUtils from './video';

function drawLine(ctx, begin, end, color) {
  ctx.beginPath();
  ctx.moveTo(begin.x, begin.y);
  ctx.lineTo(end.x, end.y);
  ctx.lineWidth = 3;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function scalePoint({ x, y }, ratio) {
  return {
    x: x * ratio,
    y: y * ratio
  };
}

function drawScaledRect(
  ctx,
  {
    topLeftCorner,
    bottomLeftCorner,
    topRightCorner,
    bottomRightCorner
    // topRightFinderPattern,
    // topLeftFinderPattern,
    // bottomLeftFinderPattern,
    // bottomRightAlignmentPattern
  },
  ratio
) {
  const color = '#FF3B58';
  // Draw dots:
  // [
  //   topRightFinderPattern,
  //   topLeftFinderPattern,
  //   bottomLeftFinderPattern,
  //   bottomRightAlignmentPattern
  // ].forEach(point => {
  //   const scaled = scalePoint(point, ratio);
  //   drawDot(ctx, scaled, color);
  // });

  const topRightScaled = scalePoint(topRightCorner, ratio);
  const bottomLeftScaled = scalePoint(bottomLeftCorner, ratio);
  const topLeftScaled = scalePoint(topLeftCorner, ratio);
  const bottomRightScaled = scalePoint(bottomRightCorner, ratio);

  drawLine(ctx, topLeftScaled, topRightScaled, color);
  drawLine(ctx, topRightScaled, bottomRightScaled, color);
  drawLine(ctx, bottomRightScaled, bottomLeftScaled, color);
  drawLine(ctx, bottomLeftScaled, topLeftScaled, color);
}

function matchDimensions(virtualCanvas, outputCanvas, inputVideo) {
  const mediaDims = videoUtils.matchDimensions(
    virtualCanvas,
    inputVideo,
    false
  );
  const mediaWidth = mediaDims.width;
  const mediaHeight = mediaDims.height;

  const outputDims = videoUtils.matchDimensions(
    outputCanvas,
    inputVideo,
    false
  );
  const outputWidth = outputDims.width;
  const outputHeight = outputDims.height;

  if (!mediaWidth || !mediaHeight || !outputWidth || !outputHeight) {
    return null;
  }

  return { mediaWidth, mediaHeight, ratio: outputWidth / mediaWidth };
}

let dims = null;
let virtualCanvas = null;
let virtualCtx = null;
let video = null;
let canvas = null;
let canvasCtx = null;

export function setMedia(videoEl, canvasEl) {
  virtualCanvas = document.createElement('canvas');
  virtualCtx = virtualCanvas.getContext('2d');
  canvas = canvasEl;
  canvasCtx = canvas.getContext('2d');
  video = videoEl;
}

export function getWorkerData() {
  if (!video || video.paused || video.ended) {
    return null;
  }

  if (!dims) {
    dims = matchDimensions(virtualCanvas, canvas, video);
    return null;
  }

  virtualCtx.drawImage(video, 0, 0, dims.mediaWidth, dims.mediaHeight);
  const imageData = virtualCtx.getImageData(
    0,
    0,
    dims.mediaWidth,
    dims.mediaHeight
  );

  const { data, width, height } = imageData;
  return { data, width, height };
}

export function drawCode(code) {
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  if (code) {
    drawScaledRect(canvasCtx, code.location, dims.ratio);
  }
}
