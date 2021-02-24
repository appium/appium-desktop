import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from 'antd';
import { STATUS_RUNNING, STATUS_STOPPING,
         STATUS_STOPPED } from '../../reducers/ServerMonitor';
import styles from './ServerMonitor.css';
import AnsiConverter from 'ansi-to-html';
import { withTranslation } from '../../util';

import AppiumSmallMagenta from '../../images/appium_small_magenta.png';
import {
  PauseOutlined,
  SearchOutlined,
  DownloadOutlined,
  CloseOutlined,
  CodeFilled
} from '@ant-design/icons';
import { BUTTON } from '../../../../../shared/components/AntdTypes';

const convert = new AnsiConverter({fg: '#bbb', bg: '#222'});
const MAX_LOGS_RENDERED = 1000;

function leveler (level) {
  switch (level) {
    case 'debug':
      return 'message';
    case 'warn':
      return 'exclamation-circle';
    case 'error':
      return 'close-circle';
    case 'silly':
      return 'paper-clip';
    case 'info':
    default:
      return 'info-circle';
  }
}

class StopButtonComponent extends Component {
  render () {
    const {serverStatus, stopServer, closeMonitor, t} = this.props;
    let btn = <Tooltip title={t('Stop Server')}
      placement="bottomLeft">
      <Button
        icon={<PauseOutlined/>}
        className={styles.serverButton}
        onClick={stopServer} />
    </Tooltip>;
    if (serverStatus === STATUS_STOPPED) {
      btn = <Tooltip title={t('Close Logs')} placement="bottomLeft">
        <Button
          className={styles.serverButton}
          icon={<CloseOutlined/>}
          onClick={closeMonitor} />
      </Tooltip>;
    } else if (serverStatus === STATUS_STOPPING) {
      btn = <Tooltip title={t('Stopping…')} visible={true}
        placement="bottomLeft">
        <Button
          icon={<PauseOutlined/>}
          className={styles.serverButton}
          type={BUTTON.DISABLED} />
      </Tooltip>;
    }
    return btn;
  }
}

StopButtonComponent.propTypes = {
  serverStatus: PropTypes.string.isRequired,
};

const StopButton = withTranslation(StopButtonComponent);

class StartSessionButtonComponent extends Component {
  render () {
    const {serverStatus, startSession, t} = this.props;
    if (serverStatus !== STATUS_STOPPED && serverStatus !== STATUS_STOPPING) {
      return <Tooltip title={t('Start Inspector Session')}>
        <Button
          className={styles.serverButton} id='startNewSessionBtn'
          icon={<SearchOutlined/>}
          onClick={startSession} />
      </Tooltip>;
    } else {
      return null;
    }
  }
}

StartSessionButtonComponent.propTypes = {
  serverStatus: PropTypes.string.isRequired,
  startSession: PropTypes.func.isRequired,
};

const StartSessionButton = withTranslation(StartSessionButtonComponent);

class GetRawLogsButtonComponent extends Component {
  render () {
    const {t, getRawLogs} = this.props;
    return <Tooltip title={t('Get Raw Logs')}>
      <Button className={styles.serverButton}
        icon={<DownloadOutlined/>}
        onClick={() => getRawLogs()} />
    </Tooltip>;
  }
}

const GetRawLogsButton = withTranslation(GetRawLogsButtonComponent);

export default class ServerMonitor extends Component {

  constructor (props) {
    super(props);
    this.keydownListener = this.keydownListener.bind(this);
  }

  keydownListener (e) {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      this.props.clearLogs();
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.keydownListener);
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.keydownListener);
  }

  getSnapshotBeforeUpdate () {
    this.shouldScroll = false;
    let n = this._term;
    if (n) {
      this.shouldScroll = n.scrollTop + n.offsetHeight >= n.scrollHeight;
    }
    return null;
  }

  componentDidUpdate () {
    if (this._term && this.shouldScroll) {
      this._term.scrollTop = this._term.scrollHeight;
    }
  }

  render () {
    const {logLines, serverStatus, serverArgs, t} = this.props;
    let statusIcon, statusMsg;
    switch (serverStatus) {
      case STATUS_RUNNING:
        statusIcon = 'play-circle';
        statusMsg = t('The server is running');
        break;
      case STATUS_STOPPED:
        statusIcon = 'pause-circle';
        statusMsg = t('The server is stopped');
        break;
      case STATUS_STOPPING:
        statusIcon = 'loading';
        statusMsg = t('The server is waiting for all connections to close');
        break;
      default:
        throw new Error(t('badStatus', {serverStatus}));
    }

    let logLineSection = logLines.slice(logLines.length - MAX_LOGS_RENDERED).map((line, i) => {
      let icn = leveler(line.level);

      return (
        <div key={i}>
          <CodeFilled type={icn} />
          {
            serverArgs.logTimestamp &&
            <span className={styles.timestamp}>
              [{line.timestamp}]
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

    let lastSection = '';
    if (serverStatus === STATUS_STOPPED) {
      lastSection = <div className={styles.last} />;
    }


    return (
      <div className={styles.container} id='serverMonitorContainer'>
        <div className={`${styles.bar} ${styles['bar-' + serverStatus]}`}>
          <img src={AppiumSmallMagenta} className={styles.logo} />
          <div className={`${styles.status} ${styles[serverStatus]}`}>
            <CodeFilled type={statusIcon} />
            {statusMsg}
          </div>
          <div className={`${styles['button-container']}`}>
            <StartSessionButton {...this.props} />
            <GetRawLogsButton {...this.props} />
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

ServerMonitor.propTypes = {
  stopServer: PropTypes.func.isRequired,
  closeMonitor: PropTypes.func.isRequired,
  serverStatus: PropTypes.string.isRequired,
  logLines: PropTypes.array.isRequired,
  startSession: PropTypes.func.isRequired,
  serverArgs: PropTypes.object.isRequired,
};
