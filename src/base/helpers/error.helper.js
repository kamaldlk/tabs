import {
  ERROR_MESSAGES
} from '../utils/error.message';

/* Error helper method */
export const getErrorText = (errrorCode, args) => {

  if (errrorCode) {

    if (args) {
      try {
        args = JSON.parse(args);
      } catch (error) {
        console.warn(error);
      }
    }

    const transMessage = ERROR_MESSAGES[errrorCode] || args;
    const body = document.getElementsByTagName('body');
    const loader = document.getElementById('global-loader');

    if (loader !== null) {
      body[0].removeChild(loader);
    }

    return transMessage || 'Something went wrong. Please contact customer support.';
  }
};