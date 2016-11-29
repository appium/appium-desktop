import React, { Component, PropTypes } from 'react';
import styles from './ServerMonitor.css';

export default class Session extends Component {
  static propTypes = {
    hello: PropTypes.string.isRequired
  }

  componentWillUpdate () {
  }

  componentDidUpdate () {
  }

  render () {
    return (
      <div className={styles.container}>
        <h1>Session!</h1>
      </div>
    );
  }
}
