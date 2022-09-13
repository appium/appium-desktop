import React, { Component } from 'react';
import { shell } from 'electron';
import PropTypes from 'prop-types';
import { Button, Tooltip } from 'antd';
import { STATUS_RUNNING, STATUS_STOPPING,
         STATUS_STOPPED } from '../../reducers/ServerMonitor';
import styles from './ServerMonitor.css';
import { withTranslation } from '../../util';
import AnsiToHtml from 'ansi-to-html';

import AppiumSmallMagenta from '../../images/appium_small_magenta.png';
import {
  PauseOutlined,
  SearchOutlined,
  DownloadOutlined,
  CloseOutlined,
  CodeFilled,
  MinusOutlined,
  PlusOutlined,
  InfoCircleFilled,
  ExclamationCircleFilled,
  MessageFilled,
  CloseCircleFilled
} from '@ant-design/icons';
import { BUTTON } from '../../../../gui-common/components/AntdTypes';
import { replace } from 'lodash';

const MAX_LOGS_RENDERED = 1000;
const INSPECTOR_URL = 'https://github.com/appium/appium-inspector';

function leveler (level) {
  switch (level) {
    case 'debug':
      return 'message';
    case 'warn':
      return 'exclamation-circle';
    case 'error':
      return 'close-circle';
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
    const {serverStatus, t} = this.props;
    const openInspector = () => shell.openExternal(INSPECTOR_URL);

    if (serverStatus !== STATUS_STOPPED && serverStatus !== STATUS_STOPPING) {
      return <Tooltip title={t('inspectorMoved', {url: INSPECTOR_URL})}>
        <Button
          className={styles.serverButton} id='startNewSessionBtn'
          icon={<SearchOutlined/>}
          onClick={openInspector}
        />
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

class DecreaseFontSizeButtonComponent extends Component {
  render () {
    const {serverStatus, t} = this.props;
    const decreaseFontSize = () => {
      let fontSize = document.querySelector("div[class*='_term_']").style['font-size'];
      if (!fontSize) {
        fontSize = '12px';
      }
      let fontSizeNumerals = fontSize.replace(/px/g, '');
      let smallerFontSize = parseFloat(fontSizeNumerals) * 0.9;
      document.querySelector("div[class*='_term_']").style['font-size'] = smallerFontSize + 'px';
    };

    if (serverStatus !== STATUS_STOPPED && serverStatus !== STATUS_STOPPING) {
      return <Tooltip title={t('Decrease log text size')}>
        <Button
          className={styles.serverButton} id='decreaseFontSizeBtn'
          icon={<MinusOutlined/>}
          onClick={decreaseFontSize}
        />
      </Tooltip>;
    } else {
      return null;
    }
  }
}

DecreaseFontSizeButtonComponent.propTypes = {};

const DecreaseFontSizeButton = withTranslation(DecreaseFontSizeButtonComponent);

class IncreaseFontSizeButtonComponent extends Component {
  render () {
    const {serverStatus, t} = this.props;
    const increaseFontSize = () => {
      let fontSize = document.querySelector("div[class*='_term_']").style['font-size'];
      if (!fontSize) {
        fontSize = '12px';
      }
      let fontSizeNumerals = fontSize.replace(/px/g, '');
      let largerFontSize = parseFloat(fontSizeNumerals) * 1.1;
      document.querySelector("div[class*='_term_']").style['font-size'] = largerFontSize + 'px';
    };

    if (serverStatus !== STATUS_STOPPED && serverStatus !== STATUS_STOPPING) {
      return <Tooltip title={t('Increase log text size')}>
        <Button
          className={styles.serverButton} id='increaseFontSizeBtn'
          icon={<PlusOutlined/>}
          onClick={increaseFontSize}
        />
      </Tooltip>;
    } else {
      return null;
    }
  }
}

IncreaseFontSizeButtonComponent.propTypes = {};

const IncreaseFontSizeButton = withTranslation(IncreaseFontSizeButtonComponent);
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
      const ansiToHtml = new AnsiToHtml();
      let icn = leveler(line.level);

      let levelsToNumber = {
        'debug': 0,
        'info': 1,
        'warn': 2,
        'error': 3
      };

      let html = (
        <div key={i}>
          {
            serverArgs.logTimestamp && <span className={styles.timestamp}> [{line.timestamp}] </span>
          }
          {
            levelsToNumber[line.level] >= levelsToNumber[serverArgs.loglevel] ?
              <>
                {icn === 'info-circle' ? <InfoCircleFilled id="infoCircleIcon" /> : <></> }
                {icn === 'exclamation-circle' ? <ExclamationCircleFilled id="exclamationCircleIcon" /> : <></> }
                {icn === 'message' ? <MessageFilled id="messageIcon" /> : <></> }
                {icn === 'close-circle' ? <CloseCircleFilled id="closeCircleIcon" /> : <></>}
                <span dangerouslySetInnerHTML={{ __html: ansiToHtml.toHtml(line.msg) }} />
              </>
              : <></>
          }
        </div>
      );

      return html;
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
            <DecreaseFontSizeButton {...this.props} />
            <IncreaseFontSizeButton {...this.props} />
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
