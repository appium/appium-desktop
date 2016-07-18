import React, { Component, PropTypes } from 'react';
import { Button } from 'react-photonkit';
import { STATUS_RUNNING, STATUS_STOPPED } from '../reducers/server-monitor';
import styles from './ServerMonitor.css';

export default class ServerMonitor extends Component {
  static propTypes = {
    stopServer: PropTypes.func.isRequired,
    closeMonitor: PropTypes.func.isRequired,
    serverStatus: PropTypes.string.isRequired,
    logLines: PropTypes.array.isRequired,
  }

  componentDidMount () {
    // make sure we listen for unexpected exit
    this.props.beginMonitoring();
  }

  componentDidUpdate () {
    if (this._term) {
      this._term.scrollTop = this._term.scrollHeight;
    }
  }

  render () {
    const {closeMonitor, stopServer, logLines, serverStatus} = this.props;
    let statusIcon, statusMsg;
    switch (serverStatus) {
      case STATUS_RUNNING:
        statusIcon = "icon-arrows-ccw";
        statusMsg = "The server is running";
        break;
      case STATUS_STOPPED:
        statusIcon = "icon-stop";
        statusMsg = "The server is stopped";
        break;
      default:
        throw new Error(`Bad status: ${serverStatus}`);
    }
    return (
      <div className={styles.container}>
        <div className={styles.bar}>
          <img src={'../images/appium_small_light.png'} className={styles.logo} />
          <div className={`${styles.status} ${styles[serverStatus]}`}>
            <span className={`icon ${statusIcon}`} />
            {statusMsg}
          </div>
          {
            serverStatus === STATUS_STOPPED ?
              <Button className={styles.stopButton} ptStyle="default"
               text="Close Logs" onClick={closeMonitor}
              />
            :
              <Button className={styles.stopButton} ptStyle="default"
               text="Stop Server" onClick={stopServer}
              />
          }
        </div>
        <div
         className={`${styles.term} ${serverStatus === STATUS_STOPPED ? styles['term-stopped'] : ""}`}
         ref={(c) => this._term = c}>
          {logLines.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      </div>
    );
  }
}
