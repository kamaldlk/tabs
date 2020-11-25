import { STORAGE } from '../store/context';

/* Get stored authentication tokens from storage */
export const getAuthenticationTokens = () => {

  try {
    if (localStorage.getItem(STORAGE.AUTHENTICATION_TOKENS)) {
      return JSON.parse(localStorage.getItem(STORAGE.AUTHENTICATION_TOKENS));
    }
  } catch (err) {
    console.error(err);
  }
  return false;
};

/* Store the authentication token in stroage */
export const setAuthenticationTokens = (tokens) => {
  localStorage.setItem(STORAGE.AUTHENTICATION_TOKENS, JSON.stringify(tokens));
};

/* Remove the authentication token from storage */
export const removeAuthenticationTokens = () => {
  localStorage.removeItem(STORAGE.AUTHENTICATION_TOKENS);
};

/* Check is application is runnig dev or prod mode */
export const isDevelopmentMode = () => {
  return (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');
};
