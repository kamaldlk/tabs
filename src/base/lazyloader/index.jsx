import React, { lazy, Suspense } from "react";
import PropTypes, { string } from "prop-types";
// import { Spinner } from "../../loaders/spinner";

export function LazyLoadComponent(props) {
  const { component, componentName, loader, error, ...rest } = props;
  const LazyLoadedComponent = lazy(() =>
    component().then(module => {
      return { default: module[componentName || "default"] };
    })
  );
  console.log(error);
  return (
    <Suspense fallback={loader || "loading..."}>
      <LazyLoadedComponent {...rest} />
    </Suspense>
  );
}

LazyLoadComponent.propTypes = {
  component: PropTypes.any,
  componentName: string,
  loader: PropTypes.node,
  error: PropTypes.node
};

export function LazyLoad({ component, componentName }) {
  const loadComponent = () =>
    component().then(module => {
      return { default: module[componentName || "default"] };
    });
  const LazyLoadedComponent = lazy(loadComponent);
  LazyLoadedComponent.preload = loadComponent();
  LazyLoadedComponent.displayName = componentName;
  return LazyLoadedComponent;
}
