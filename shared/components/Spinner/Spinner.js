import React from 'react';
import styles from './Spinner.css';

const Spinner = () => (
  <div className={styles.container}>
    <div className={styles.loader}/>
  </div>
);

export default Spinner;