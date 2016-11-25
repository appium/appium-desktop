import React, { Component, PropTypes } from 'react';
import { Input, CheckBox } from 'react-photonkit';

import { propTypes, updateArg } from './shared';
import { ARG_DATA } from '../../reducers/StartServer';
import StartButton from './StartButton';
import SavePresetButton from './SavePresetButton';
import styles from './AdvancedTab.css';
import parentStyles from './StartServer.css';

// args we build a UI for:
// ipa, address, port, callbackAddress, callbackPort,
// bootstrapPort, backendRetries, sessionOverride, log,
// logLevel, logTimestamp, localTimezone, logNoColors,
// defaultDevice, automationTraceTemplatePath, instrumentsPath,
// nodeconfig, robotAddress, robotPort, selendroidPort,
// chromeDriverPort, chromedriverExecutable, enforceStrictCaps,
// isolateSimDevice, tmpDir, traceDir, debugLogSpacing,
// suppressAdbKillServer, webkitDebugProxyPort, defaultCapabilities

export default class AdvancedTab extends Component {
  static propTypes = {...propTypes};

  buildInput (argName, type, label) {
    const {serverArgs} = this.props;

    if (type === "text") {
      return (
        <div className={styles.input}>
          <label>{label}</label>
          <input className={"form-control"} ref={argName} type="text"
            defaultValue={serverArgs[argName]}
            name={argName} onChange={updateArg.bind(this)}
          />
        </div>
      );
    }

    if (type === "checkbox") {
      return (
        <div className={styles.input}>
          <label>{label}</label>
          <input className={"form-control"} ref={argName} type="checkbox"
            name={argName} defaultChecked={serverArgs[argName]}
            onChange={updateArg.bind(this)}
          />
        </div>
      );
    }

    if (type === "textarea") {
      return "";
    }

    throw new Error(`Invalid type ${type}`);
  }

  render () {
    const {startServer, serverStarting, presetSaving, savePreset} = this.props;

    return (
      <div className={styles.advancedForm}>
        <form onSubmit={startServer}>
          <div className={styles.inputSection}>
            <div className={styles.secTitle}>General</div>
            <div className={styles.secBody}>
              {this.buildInput('address', 'text', 'Server Address')}
              {this.buildInput('port', 'text', 'Server Port')}
              {this.buildInput('log', 'text', 'Logfile Path')}
              {this.buildInput('loglevel', 'text', 'Log Level')}
              {this.buildInput('tmpDir', 'text', 'Override Temp Path')}
              {this.buildInput('nodeconfig', 'text', 'Node Config File Path')}
              {this.buildInput('localTimezone', 'checkbox', 'Local Timezone')}
              {this.buildInput('sessionOverride', 'checkbox', 'Allow Session Override')}
              {this.buildInput('logTimestamp', 'checkbox', 'Log Timestamps')}
              {this.buildInput('logNoColors', 'checkbox', 'Supress Log Color')}
              {this.buildInput('enforceStrictCaps', 'checkbox', 'Strict Caps Mode')}
              {this.buildInput('defaultCapabilities', 'textarea', 'Default Capabilities')}
            </div>
            <div className={styles.secTitle}>iOS</div>
            <div className={styles.secTitle}>Android</div>
          </div>
          <div className={styles.actions}>
            <StartButton {...{serverStarting, startServer}} />
            <SavePresetButton {...{savePreset, presetSaving}} />
          </div>
        </form>
      </div>
    );
  }
}
