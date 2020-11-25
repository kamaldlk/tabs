import React, { useState, useEffect } from "react";
import propTypes from "prop-types";
import { Subject } from "rxjs";
import "./loader.scss";

const onLoaderChange$ = new Subject();
const onLoaderChange = () => onLoaderChange$.asObservable();

const loaderListener = { subscription: undefined };

export const setLoader = (isLoading, timer = 1000) => {
  onLoaderChange$.next({ loading: isLoading, timer: timer });
};

export function Loader(props) {
  const { manual } = props;

  const [setIsLoading] = useState(manual ? false : true);

  useEffect(() => {
    loaderListener.subscription = onLoaderChange().subscribe(
      ({ loading, timer }) => {
        if (loading) {
          setIsLoading(loading);
        } else {
          setTimeout(() => setIsLoading(loading), timer);
        }
      }
    );

    return () => {
      loaderListener.subscription.unsubscribe();
    };
  }, [setIsLoading]);

  return <div>loading....</div>;
}

Loader.propTypes = {
  manual: propTypes.bool
};
