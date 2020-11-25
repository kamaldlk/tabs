function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

window.isMobile = isMobile;

(
  function IntersectionObserverPolyfills() {
    if (!window.IntersectionObserver) {
      import('intersection-observer')
        .then((module) => {
          console.info('=====> Intersection observer loaded ');
        })
        .catch(err => {
          console.error('Failed to load intersection observer', err);
        });
    }

    if (!window.requestIdleCallback) {
      console.log("******* requestIdleCallback polyfill ****");
      window.requestIdleCallback = (cb) => {
        return setTimeout(cb, 200);
      };

      window.cancelIdleCallback = (timerId) => {
        clearTimeout(timerId);
      };
    }
  }
)();

(
  function ResizeObserverPolyfills() {
    if (!window.ResizeObserver && isMobile() === false) {
      import('@juggle/resize-observer')
        .then(ResizeObserver => {
          window.ResizeObserver = ResizeObserver.default;
        })
        .catch(err => {
          console.error("Failed to load resizeObserver polyfills", err);
        });
    }
  }
)();

/* eslint-disable */
Object.defineProperty(Array.prototype, 'isEmpty', {
  value: function () {
    return this.length === 0;
  },
  writable: false
});

String.prototype.capitalize = function () {
  return this.charAt().toUpperCase() + this.slice(1);
}