import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ErrorBoundary } from '../base/errorboundary';
import { Loader } from '../base/loader';
const AppHome = lazy(() => import('../apphome'));

function Router() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route path='/' render={() => <AppHome />} />
          </Switch>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter >
  );
}

export {
  Router
};