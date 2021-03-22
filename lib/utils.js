const debug =
  (process && process.env && process.env.ELECTRON_SECURE_SEARCH_DEBUG) || false;
const print = debug ? console.log.bind(console) : () => {};

const on = (element, event, handler) => {
  if (element && event && handler) {
    element.addEventListener(event, handler, false);
  }
};

const off = (element, event, handler) => {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false);
  }
};

const once = (element, event, fn) => {
  if (element && event && handler) {
    element.addEventListener(event, handler, { once: true });
  }
};

const move = (element, end, duration = 300) => {
  return new Promise((resolve, reject) => {
    try {
      let winFrameId = null;
      let stepTime = duration / (1000 / 60);
      let curr = parseInt(element.style.top);
      let stepDist = (end - curr) / stepTime;
      let stepCnt = 0;

      const step = function () {
        curr += stepDist;
        stepCnt++;
        if (stepCnt >= stepTime || Math.abs(end - curr) <= stepDist + 1) {
          element.style.top = `${end}px`;
          if (winFrameId) {
            window.cancelAnimationFrame(winFrameId);
            winFrameId = null;
          }
          resolve();
        } else {
          element.style.top = `${curr}px`;
          winFrameId = window.requestAnimationFrame(step);
        }
      };
      step();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  print,
  on,
  off,
  once,
  move,
};
