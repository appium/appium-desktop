import React, { Component } from 'react';
import styles from './Session.css';
import NewSessionForm from './Session/NewSessionForm';
import RecentSessions from './Session/RecentSessions';
import moment from 'moment';
window.moment = moment;

export default class Session extends Component {

  render () {
    return (
      <div className={styles.container}>
        <h2>Start New Session</h2>
        <NewSessionForm {...this.props} />
        <h2>Recent Sessions</h2>
        <RecentSessions {...this.props} />
      </div>
    );
  }
}