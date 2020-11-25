window.onerror = function(msg, file, line, col, error) {
  //Logger.error(error);
};

export const Logger = {
  log() {
    // StackTrace.get().then(callback('Info', ...arguments)).catch(errCallback);
  },

  warn() {
    // StackTrace.get().then(callback('Warn', ...arguments)).catch(errCallback);
  },

  error(err) {
    let type = typeof err;
    if (type === 'object') {
      // StackTrace.fromError(err).then(callback('Error', ...arguments)).catch(errCallback);
    } else {
      // StackTrace.get().then(callback('Error', ...arguments)).catch(errCallback);
    }
  },

  info() {
    // StackTrace.get().then(callback('Info', ...arguments)).catch(errCallback);
  }
};


if (process.env.REACT_APP_LOGGER) {
  const consoleLog = console.log;

  function fakeLog() {
    //do nothing for console.log
    if (window.enableLog) {
      consoleLog(...arguments);
    }
  }
  //do not print anything in console except error;
  console.log = fakeLog;
  console.info = fakeLog;
  console.warn = fakeLog;
  console.error = fakeLog;
}