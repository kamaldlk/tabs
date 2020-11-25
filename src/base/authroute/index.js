import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import propTypes from "prop-types";
import { Subject } from 'rxjs';
import { getAuthenticationTokens, setAuthenticationTokens, removeAuthenticationTokens } from '../helpers/http.helper';

/* Subject object for handling events */
export const onAuthenticationChange$ = new Subject();
export const onUserAvatarChange$ = new Subject();
export const onUserAddedInOrg$ = new Subject();

/* Authentication store to keep tracking of logged in status */
export const AuthenticationStore = {
  isLoggedIn: !!getAuthenticationTokens(),

  login(tokens) {
    setAuthenticationTokens(tokens); // Set storage
    this.isLoggedIn = true;
    onAuthenticationChange$.next(this.isLoggedIn);
  },

  logout(canLogout = true) {
    if (this.isLoggedIn && canLogout) { // Perform the logout only, if user logged in
      removeAuthenticationTokens(); // Remove storage
      this.isLoggedIn = false;
      onAuthenticationChange$.next(this.isLoggedIn);
    }
    if (!canLogout) {
      onAuthenticationChange$.next(false);
    }
  }
};

/* Wrapper Route component for handling authentication */
export function AuthRoute({ component: Component, ...rest }) {
  const hostname = window.location.hostname;
  const page = (hostname === 'app.affixin.com' || !(hostname.indexOf('affixin.com') > -1)) ? '' : 'signin';

    /* Render the JSX elements */
  return (
    <Route {...rest}
      render={() => (!AuthenticationStore.isLoggedIn ? <Component />
        : <Redirect to={`/authentication/${page}`} />)}
    />
  );
}



AuthRoute.propTypes = {
  component: propTypes.any
};
