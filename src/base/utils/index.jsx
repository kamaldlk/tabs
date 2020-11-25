
import { ERROR_MESSAGES } from "../resource/error.message";

export const getErrorText = (errrorCode, args) => {
  if (errrorCode) {
    if (args) {
      try {
        args = JSON.parse(args);
      } catch (error) {
        console.warn(error);
      }
    }
    let transMessage = ERROR_MESSAGES[errrorCode];
    return (transMessage, args || `Something went wrong. Please contact customer support.`
    );
  }
};