import React from 'react';
import { Router } from './router';
import styles from './styles/index.scss';

function App() {

  return (
    <div className={styles.appContainer}>
      <Router />
    </div>
  );
}

export{
  App
};