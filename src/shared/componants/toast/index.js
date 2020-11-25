import React from "react";
import PropTypes from "prop-types";

import styles from "./toast.css";

export const ToastBox = ({ messages, type }) => {
  type = type || "info";

  return (
    <div className={`${styles.toastBox} ${styles[type]}`}>
      <ul className={styles.message}>
        {messages.map(message => {
          return (
            <li key="message">
              <div className={styles.icon}>
                X
                {/* <SvgIcon name={icon[type]} padding={PADDING_NONE} size={12} className={styles.toastIcon}/> */}
              </div>
              {/* Todo should replace this.props.children to remove dangerouslySetInnerHTML */}
              <div
                className={`marutham-body ${styles.text}`}
                dangerouslySetInnerHTML={{ __html: message }}
              />
            </li>
          );
        })}
      </ul>
      X
    </div>
  );
};

ToastBox.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.string
};
