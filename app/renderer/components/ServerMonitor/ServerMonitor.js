import React, { Component } from 'react';
import { shell } from 'electron';
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
  CodeFilled,
  MinusOutlined,
  PlusOutlined,
  InfoCircleFilled,
  ExclamationCircleFilled,
  MessageFilled,
  PaperClipFilled,
  CloseCircleFilled
} from '@ant-design/icons';
import { BUTTON } from '../../../../gui-common/components/AntdTypes';

const convert = new AnsiConverter({fg: '#bbb', bg: '#222'});
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
      let icn = leveler(line.level);

      let lineHtml = convert.toHtml(line.msg);
      // using colors defined in: https://terminal.sexy/
      if (lineHtml.includes('[Appium]') || lineHtml.includes('[Instrumentation]')) {
        lineHtml = lineHtml.replace('color:#A0A', 'color:#AA759F'); // INFO: better terminal-friendly "magenta"
      } else if (lineHtml.includes('[HTTP]')) {
        lineHtml = lineHtml.replace('color:#A0A', 'color:#75B5AA');
      } else if (lineHtml.includes('[BaseDriver]') || lineHtml.includes('[WD Proxy]') || lineHtml.includes('[W3C')) {
        lineHtml = lineHtml.replace('color:#A0A', 'color:#F4BF75');
      } else if (lineHtml.includes('[UiAutomator2]') || lineHtml.includes('[AndroidDriver]')) {
        lineHtml = lineHtml.replace('color:#A0A', 'color:#90A959');
      } else if (lineHtml.includes('[ADB]') || lineHtml.includes('[Logcat]')) {
        lineHtml = lineHtml.replace('color:#A0A', 'color:#90A959');
      } else if (lineHtml.includes('[tvOSSim]') || lineHtml.includes('[WebDriverAgent]') || lineHtml.includes('[XCUITest]')) {
        lineHtml = lineHtml.replace('color:#A0A', 'color:#6A9FB5');
      } else if (lineHtml.includes('[DevCon Factory]') || lineHtml.includes('[IOSSimulatorLog]')) {
        lineHtml = lineHtml.replace('color:#A0A', 'color:#6A9FB5');
      }

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
                {icn === 'info-circle' ? <InfoCircleFilled id="messageIcon" /> : <></> }
                {icn === 'exclamation-circle' ? <ExclamationCircleFilled id="messageIcon" /> : <></> }
                {icn === 'message' ? <MessageFilled id="messageIcon" /> : <></> }
                {icn === 'silly' ? <PaperClipFilled id="messageIcon" /> : <></> }
                {icn === 'close-circle' ? <CloseCircleFilled id="messageIcon" /> : <></>}
                <span dangerouslySetInnerHTML={{ __html: lineHtml }} />
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
