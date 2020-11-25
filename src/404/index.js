import React from "react";
import ReactDOM from "react-dom";
import styles from './404.module.scss';
export function Error404() {

  return ReactDOM.createPortal(
    <div className={styles.mainWrapper}>
      The page you are looking for may have been deleted or is temporarily
            unavaiable
    </div>,
    document.getElementById("error-404")
  );
}
