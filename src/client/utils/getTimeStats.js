const forwardTimes = {};
export default function getTimeStats(key, timeInMs) {
  if (!forwardTimes[key]) {
    forwardTimes[key] = [];
  }

  forwardTimes[key] = [timeInMs].concat(forwardTimes[key]).slice(0, 30);
  const avgTimeInMs = forwardTimes[key].reduce((total, t) => total + t) / forwardTimes[key].length;
  return {
    time: Math.round(avgTimeInMs),
    fps: Math.round(1000 / avgTimeInMs)
  };
}
