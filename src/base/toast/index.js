import {
  error,
  success,
  warn,
  dismiss
} from '../../shared/componants/toast/toast.methods';

export const toast = {
  success: (message, option) => success(message, option),
  error: (err, option) => error(err, option),
  warn: (err, option) => warn(err, option),
  dismiss: (toastId) => dismiss(toastId)
};