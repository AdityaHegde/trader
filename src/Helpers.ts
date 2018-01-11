const $setTimeout = global.setTimeout;

class Helpers {
  static wait(duration) {
    return new Promise(resolve => $setTimeout(resolve, duration));
  }

  static waitFor(fun, maxDuration = -1) {
    return new Promise((resolve) => {
      let start = new Date().getTime();
      let tick = function () {
        if (fun() || new Date().getTime() - start >= maxDuration) {
          resolve();
        } else {
          $setTimeout(tick, 100);
        }
      }
      tick();
    });
  }

  static waitForEvent(target, eventName) {
    return new Promise((resolve) => {
      target.once(eventName, (...data) => {
        resolve(...data);
      });
    });
  }
}

module.exports = Helpers;
