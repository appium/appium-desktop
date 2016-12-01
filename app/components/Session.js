import React, { Component } from 'react';
import styles from './Session.css';
import NewSessionForm from './Session/NewSessionForm';

export default class Session extends Component {

  render () {
    return (
      <div className={styles.container}>
        <h2>Start New Session</h2>
        <NewSessionForm {...this.props} />
      </div>
    );
  }
}