import { Logger } from '../logger';
import {  toast } from '../toast';
import { StoreProvider } from "../store";
import { config } from './config';
function getRecaptchaToken(action, recaptchaSitekey) {
  return new Promise((resolve) => {
    window.grecaptcha && window.grecaptcha.ready(() => {
      window.grecaptcha.execute(recaptchaSitekey, {
        action: action
      })
        .then(resolve);
    });
  });
}

function getCSRFToken() {
  let appStore = StoreProvider.getStore('App');
  let accountDetails = appStore.get('accountDetails');
  return accountDetails && accountDetails.AuthToken;
}

function isAFDomain(url) {
  return url.startsWith('/');
}

const createRequest = (url, reqConfig) => {
  var headers = Object.assign({
    "Content-Type": "application/json"
  }, reqConfig.header || {});

  if (isAFDomain(url)) {
    headers['X-Csrf-Token'] = getCSRFToken();
  }

  if (localStorage.getItem('token')) {
    headers['vc-authorization'] = localStorage.getItem('token');
  }

  if (reqConfig.query) {
    url = serializeQueryParams(url, reqConfig.query);
  }

  var requestOption = {
    method: reqConfig.method,
    headers: headers,
    credentials: reqConfig.isCORS ? "include" : "same-origin"
  };

  if (reqConfig.data) {
    requestOption["body"] = (typeof reqConfig.data !== "string") ? JSON.stringify(reqConfig.data) : reqConfig.data;
  } else if (reqConfig.body) {
    requestOption["body"] = reqConfig.body;
  }

  if (reqConfig.signal) {
    requestOption['signal'] = reqConfig.signal;
  }

  return new Request(url, requestOption);
};

const serializeQueryParams = (url, params = {}) => {
  var queryString = url.lastIndexOf('?') !== -1 ? `&` : `?`;
  Object.keys(params)
    .forEach((key) => {
      queryString += `${key}=${encodeURIComponent(params[key])}&`;
    });
  return `${url}${queryString}`;
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    try {
      Logger.warn("Network Request Failed", {
        url: response.url,
        status: response.status,
        statusText: response.statusText
      });
      if (response.headers.get('Content-Type') === 'application/json') {
        return response.json().then((json) => {
          return Promise.reject(json);
        });
      }
      return Promise.reject({
        errorMessage: "Unhandled server error"
      });
    } catch (err) {
      Logger.error(err);
      return Promise.reject({
        status: response.statusText
      });
    }
  }
};

const parseJSON = (response) => {
  return response.json();
};

const sendRequest = async(url, options) => {
  
  url = `${config().API_SERVER_URL}${url}`;

  let request = createRequest(url, options);
  let promise = fetch(request)
    .then(checkStatus)
    .then(parseJSON)
    .catch(err => {
      if (options.method !== 'GET') {
        let showToast = options.hasOwnProperty('toast') ? options.toast : true;
        showToast && toast.error(err);
      }
      return Promise.reject(err);
    });
  // promise.cancel = controller.abort;
  return promise;
};

const attachRecaptchaToken = async(options) => {
  let appStore = StoreProvider.getStore('App');
  let accountDetails = appStore.get('accountDetails');
  let recaptchaAction = options && options.options && options.options.recaptcha_action;
  if (!options.header) {
    options.header = {};
  }
  if (recaptchaAction) {
    let token = await getRecaptchaToken(recaptchaAction,
      accountDetails.AppConfig.ReCaptchaSiteKey);
    options.header['X-Recaptcha-Token'] = token;
  }
  return options;
};

const sendPublicRequest = async(url, options) => {
  if (isAFDomain(url)) {
    options = await attachRecaptchaToken(options);
  }
  let request = createRequest(url, options);
  let promise = fetch(request)
    .then(checkStatus)
    .then(parseJSON)
    .catch(err => {
      if (options.method !== 'GET') {
        let showToast = options.hasOwnProperty('toast') ? options.toast : true;
        showToast && toast.error(err);
      }
      return Promise.reject(err);
    });
  return promise;
};

const service = {
  get(url, options = {}) {
    options.method = "GET";
    return sendRequest(url, options);
  },

  post(url, options = {}) {
    options.method = options.method || "POST";
    return sendRequest(url, options);
  },

  update(url, options = {}) {
    options.method = "PUT";
    return this.post(url, options);
  },

  patch(url, options = {}) {
    options.method = "PATCH";
    return sendRequest(url, options);
  },

  delete(url, options = {}) {
    options.method = "DELETE";
    return sendRequest(url, options);
  },

  postq(url, options = {}, callback = () => false, queueName = "default") {
    let queue = Queue.getQueue(queueName, this);
    options.method = "POST";
    return queue.queueRequest(url, options, callback);
  },

  fetch(url, options = {}) {
    options = Object.assign({
      method: 'GET'
    }, options);
    let request = createRequest(url, options);
    return fetch(request)
      .then(checkStatus);
  },

  upload(url, options = {}) {
    let request = createRequest(url, options);
    return fetch(request).then(checkStatus)
      .catch(err => {
        return Promise.reject(err);
      });
  },

  xhrRequest: (url) => {
    // new rqeuest
    let req = new XMLHttpRequest();
    req.open("GET", url, true);
    //crsf token
    let appStore = StoreProvider.getStore('App');
    let accountDetails = appStore.get('accountDetails');
    if (accountDetails && accountDetails.AuthToken) {
      req.setRequestHeader('X-Csrf-Token', accountDetails.AuthToken);
    }
    req.responseType = "blob";
    req.send();
    return req;
  },

  download: (url) => {
    return fetch(url).then(checkStatus).then(response => response.blob())
      .catch(err => {
        return Promise.reject(err);
      });
  }
};

export default service;

export const PublicService = {
  ...service,
  ...{
    get(url, options = {}) {
      options.method = "GET";
      return sendPublicRequest(url, options);
    },
    post(url, options = {}) {
      options.method = options.method || "POST";
      return sendPublicRequest(url, options);
    },
    patch(url, options = {}) {
      options.method = "PATCH";
      return sendPublicRequest(url, options);
    },
    delete(url, options = {}) {
      options.method = "DELETE";
      return sendPublicRequest(url, options);
    },
    postq(url, options = {}, callback = () => false, queueName = "default") {
      let queue = Queue.getQueue(queueName, this);
      options.method = "POST";
      return queue.queueRequest(url, options, callback);
    },
    async upload(url, options = {}) {
      if (isAFDomain(url)) {
        options = await attachRecaptchaToken(options);
      }
      let request = createRequest(url, options);
      return fetch(request).then(checkStatus)
        .catch(err => {
          return Promise.reject(err);
        });
    }
  }
};


class Queue {
  static requestQueue = {};
  static getQueue(name = "system", httpService) {
    if (!this.requestQueue[name]) {
      this.requestQueue[name] = new Queue(name, httpService);
    }
    return this.requestQueue[name];
  }
  constructor(name, httpService) {
    this.name = name;
    this.requestQueue = [];
    this.executeQueue = this.executeQueue.bind(this);
    this.httpService = httpService;
  }
  queueRequest(url, option, callback) {
    let queueId = new Date().getTime();
    this.requestQueue.push({
      id: queueId,
      url,
      option,
      callback
    });
    //trigger the queue
    this.executeQueue();
  }
  executeQueue(updatedRequestData = null) {
    if (this.requestStatus === 'waiting') {
      //break the recurrsion;
      return;
    }
    let requestObj = this.requestQueue.shift();
    if (!requestObj) {
      return;
    }
    //if data is present then update request object with latest data
    if (updatedRequestData) {
      requestObj.option.data = updatedRequestData;
    }
    this.requestStatus = "waiting";
    let res = null;
    let err = null;
    this.httpService.post(requestObj.url, requestObj.option)
      .then((data) => {
        res = data;
      }, (error) => {
        err = error;
      })
      .finally(() => {
        this.requestStatus = "done";
        let shouldWait = (data) => {
          //proceed to next request
          this.executeQueue(data);
        };
        //check if the waiting callback method is accepted in the given callback
        //if so then wait untill callback is called, then proceed with queue execution
        if (requestObj.callback.length === 3) {
          requestObj.callback(err, res, shouldWait);
        } else {
          requestObj.callback(err, res);
          //proceed to next request
          this.executeQueue();
        }
      });
  }
  clear() {
    if (this.name === 'system') {
      return;
    }
    Reflect.deleteProperty(Queue.requestQueue, this.name);
  }
}