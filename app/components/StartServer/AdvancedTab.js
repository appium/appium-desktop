import React, { Component } from 'react';
import { Input } from 'react-photonkit';

import { propTypes, updateArg } from './shared';
import { ARG_DATA } from '../../reducers/StartServer';
import StartButton from './StartButton';
import styles from './AdvancedTab.css';
import parentStyles from './StartServer.css';

// args we build a UI for:
// shell, ipa, address, port, callbackAddress, callbackPort,
// bootstrapPort, backendRetries, sessionOverride, log,
// logLevel, logTimestamp, localTimezone, logNoColors,
// defaultDevice, automationTraceTemplatePath, instrumentsPath,
// nodeconfig, robotAddress, robotPort, selendroidPort,
// chromeDriverPort, chromedriverExecutable, enforceStrictCaps,
// isolateSimDevice, tmpDir, traceDir, debugLogSpacing,
// suppressAdbKillServer, webkitDebugProxyPort, defaultCapabilities

export default class AdvancedTab extends Component {
  static propTypes = {...propTypes}

  buildInput (argName, type, label) {
    const {updateArgs, serverArgs} = this.props;
    return (
      <div className={styles.input}>
        <Input ref={argName} type={type} defaultValue={serverArgs[argName]}
          label={label} name={argName} onChange={updateArgs.bind(this)}
        />
      </div>
    );
  }

  render () {
    const {startServer, serverStarting} = this.props;

    return (
      <div className={styles.advancedForm}>
        <form onSubmit={startServer}>
          {this.buildInput('address', 'text', 'Server Address')}
          <div className={styles.actions}>
            <StartButton {...{serverStarting, startServer}} />
          </div>
        </form>
      </div>
    );
  }
}
