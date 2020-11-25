import { getErrorText as _getErrorText } from "../../../base/utils";
import { Logger } from "../../../base/logger";

import { toast as Toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ToastBox } from "./index";
import React from "react";

let activeToasts = [];
let toastId = null;

const closeCallback = () => {
  activeToasts = [];
  toastId = null;
};

const getErrorText = err => {
  if (typeof err === "string") {
    return err;
  }
  return _getErrorText(err.error_code, err.args);
};

export function success(message, option) {
  Toast(<ToastBox messages={[message]} />, {
    hideProgressBar: true,
    closeButton: false,
    className: "toastOverride"
  });
}

export function error(err, option) {
  let message = "";
  let shownToast;
  if (typeof err === "string") {
    message = err;
  } else {
    if (!err.error_code) {
      err.error_code = "KiSSFFLOW_ERROR_UNEXPECTED";
    }
    message = getErrorText(err);
    shownToast = activeToasts.find(
      error => error.error_code === err.error_code
    );
  }

  Logger.error(err);
  //message = `${err.error_code || ''}:${err.request_id || ''}:${message}`;
  let toastOption = Object.assign(
    {
      autoClose: false,
      closeButton: false,
      className: "toastOverride",
      onClose: closeCallback
    },
    option
  );

  let messages = [message];

  if (shownToast) return;

  if (Toast.isActive(toastId)) {
    messages = messages.concat(activeToasts.map(err => getErrorText(err)));
    toastOption.render = <ToastBox type="error" messages={messages} />;
    Toast.update(toastId, toastOption);
    activeToasts.push(err);
    return;
  }
  activeToasts.push(err);
  toastId = Toast(<ToastBox messages={messages} type="error" />, toastOption);
}

export function warn(message, option) {
  Toast(<ToastBox messages={[message]} type="warn" />, {
    hideProgressBar: true,
    closeButton: false,
    className: "toastOverride"
  });
}

export function dismiss(toastId) {
  Toast.dismiss(toastId);
}

export const POSITION = Toast.POSITION;
