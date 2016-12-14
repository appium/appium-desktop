import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Button } from 'react-photonkit';
import { STATUS_RUNNING, STATUS_STOPPING,
         STATUS_STOPPED } from '../reducers/ServerMonitor';
import styles from './ServerMonitor.css';
import AnsiConverter from 'ansi-to-html';

const convert = new AnsiConverter({fg: '#bbb'});

function leveler (level) {
  switch (level) {
    case "debug":
      return "tools";
    case "warn":
      return "attention";
    case "error":
      return "cancel-circled";
    case "silly":
      return "basket";
    case "info":
    default:
      return "info-circled";
  }
}

class StopButton extends Component {
  static propTypes = {
    serverStatus: PropTypes.string.isRequired,
  }

  render () {
    const {serverStatus, stopServer, closeMonitor} = this.props;
    let btn = <Button className={styles.stopButton} ptStyle="default"
               text="Stop Server" onClick={stopServer} />;
    if (serverStatus === STATUS_STOPPED) {
      btn = <Button className={styles.stopButton} ptStyle="default"
             text="Close Logs" onClick={closeMonitor} />;
    } else if (serverStatus === STATUS_STOPPING) {
      btn = <Button className={styles.stopButton} ptStyle="disabled"
             text="Stopping..." />;
    }
    return btn;
  }
}

class StartSessionButton extends Component {
  static propTypes = {
    serverStatus: PropTypes.string.isRequired,
    startSession: PropTypes.func.isRequired,
  }

  render () {
    const {serverStatus, startSession} = this.props;
    if (serverStatus !== STATUS_STOPPED && serverStatus !== STATUS_STOPPING) {
      return <Button className={styles.stopButton} ptStyle="default"
             text="Start New Session" onClick={startSession} />;
    } else {
      return null;
    }
  }
}

export default class ServerMonitor extends Component {
  static propTypes = {
    stopServer: PropTypes.func.isRequired,
    closeMonitor: PropTypes.func.isRequired,
    serverStatus: PropTypes.string.isRequired,
    logLines: PropTypes.array.isRequired,
    startSession: PropTypes.func.isRequired,
    serverArgs: PropTypes.object.isRequired,
  }

  componentWillUpdate () {
    this.shouldScroll = false;
    let n = this._term;
    if (n) {
      this.shouldScroll = n.scrollTop + n.offsetHeight >= n.scrollHeight;
    }
  }

  componentDidUpdate () {
    if (this._term && this.shouldScroll) {
      this._term.scrollTop = this._term.scrollHeight;
    }
  }

  render () {
    const {logLines, serverStatus, serverArgs} = this.props;
    let statusIcon, statusMsg;
    switch (serverStatus) {
      case STATUS_RUNNING:
        statusIcon = "icon-arrows-ccw";
        statusMsg = "The server is running";
        break;
      case STATUS_STOPPED:
        statusIcon = "icon-block";
        statusMsg = "The server is stopped";
        break;
      case STATUS_STOPPING:
        statusIcon = "icon-hourglass";
        statusMsg = "The server is waiting for all connections to close";
        break;
      default:
        throw new Error(`Bad status: ${serverStatus}`);
    }

    let logLineSection = logLines.map((line, i) => {
      let icn = leveler(line.level);
      return (
        <div key={i}>
          <span className={`${styles.icon} ${styles[`icon-${icn}`]} icon icon-${icn}`} />
          {
            serverArgs.logTimestamp &&
            <span className={styles.timestamp}>
              [{moment().format('YYYY-MM-DD hh:mm:ss')}]
            </span>
          }
          <span dangerouslySetInnerHTML={{__html: convert.toHtml(line.msg)}} />
        </div>
      );
    });

    let termClass = styles.term;
    if (serverStatus === STATUS_STOPPED || serverStatus === STATUS_STOPPING) {
      termClass += ` ${styles['term-stopped']}`;
    }

    let lastSection = "";
    if (serverStatus === STATUS_STOPPED) {
      lastSection = <div className={styles.last} />;
    }


    return (
      <div className={styles.container}>
        <div className={`${styles.bar} ${styles['bar-'+serverStatus]}`}>
          <img src={'../images/appium_small_magenta.png'} className={styles.logo} />
          <div className={`${styles.status} ${styles[serverStatus]}`}>
            <span className={`icon ${statusIcon}`} />
            {statusMsg}
          </div>
          <div className={`${styles['button-container']}`}>
            <StartSessionButton {...this.props} />
            <StopButton {...this.props} />
          </div>
        </div>
        <div className={termClass} ref={(c) => this._term = c}>
          {logLineSection}
          {lastSection}
        </div>
      </div>
    );
  }
}
