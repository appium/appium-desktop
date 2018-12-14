import React, { Component } from 'react';
import { Modal, Input, Checkbox, notification } from 'antd';

import { propTypes, updateArg } from './shared';
import StartButton from './StartButton';
import SavePresetButton from './SavePresetButton';
import styles from './AdvancedTab.css';

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

  constructor (props) {
    super(props);
    this.state = {
      modalOpen: false,
      newPresetName: "",
    };
  }

  buildInput (argName, type, label) {
    const {serverArgs} = this.props;

    if (type === "text") {
      return (
        <div className={styles.input}>
          <Input ref={argName} type="text"
            defaultValue={serverArgs[argName]}
            name={argName} onChange={updateArg.bind(this)}
            addonBefore={label}
          />
        </div>
      );
    }

    if (type === "checkbox") {
      return (
        <div className={styles.input}>
          <Checkbox ref={argName}
            name={argName} defaultChecked={serverArgs[argName]}
            onChange={updateArg.bind(this)}
          >{label}</Checkbox>
        </div>
      );
    }

    if (type === "textarea") {
      return "";
    }

    throw new Error(`Invalid type ${type}`);
  }

  openPresetModal () {
    this.setState({
      modalOpen: true,
    });
  }

  closePresetModal () {
    this.setState({modalOpen: false});
  }

  updatePresetName (evt) {
    this.setState({newPresetName: evt.target.value});
  }

  savePreset (evt) {
    if (evt) {
      // might get here from Modal binding (no event) or form submit binding
      // (event)
      evt.preventDefault();
    }
    if (!this.state.newPresetName) {
      // don't save a preset without a name
      return;
    }
    this.props.savePreset(this.state.newPresetName, this.props.serverArgs);
    notification.success({
      message: 'Saved',
      description: `Your preset '${this.state.newPresetName}' has been added ` +
                   `to the list in the Presets tab!`
    });
    this.setState({modalOpen: false});
  }

  modal () {
    const form = (
      <div>
        <form className={styles.input}
          onSubmit={this.savePreset.bind(this)}>
          <Input autoFocus
            ref="presetName"
            name={"presetName"}
            addonBefore="Preset name"
            onChange={this.updatePresetName.bind(this)}
            size="large"
          />
          <input type="submit" hidden={true} />
        </form>
      </div>
    );

    return (
      <Modal
        visible={this.state.modalOpen}
        className={styles.presetModal}
        title="Save Server Arguments Preset"
        width={340}
        okText="Save"
        onOk={this.savePreset.bind(this)}
        cancelText="Cancel"
        onCancel={this.closePresetModal.bind(this)}
      >
        {form}
      </Modal>
    );
  }

  render () {
    const {startServer, serverStarting, presetSaving, serverVersion} = this.props;

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
              {this.buildInput('relaxedSecurityEnabled', 'checkbox', 'Relaxed Security')}
              {this.buildInput('defaultCapabilities', 'textarea', 'Default Capabilities')}
            </div>

            <div className={styles.secTitle}>iOS</div>
            <div className={styles.secBody}>
              {this.buildInput('wdaLocalPort', 'text', 'WebDriverAgent Port')}
              {this.buildInput('callbackHost', 'text', 'executeAsync Callback Host')}
              {this.buildInput('callbackPort', 'text', 'executeAsync Callback Port')}
            </div>

            <div className={styles.secTitle}>Android</div>
            <div className={styles.secBody}>
              {this.buildInput('bootstrapPort', 'text', 'Bootstrap Port')}
              {this.buildInput('selendroidPort', 'text', 'Selendroid Port')}
              {this.buildInput('chromeDriverPort', 'text', 'Chromedriver Port')}
              {this.buildInput('chromedriverExecutable', 'text', 'Chromedriver Binary Path')}
            </div>
          </div>
          <div className={styles.actions}>
            <StartButton {...{serverStarting, startServer, serverVersion}} />
            <SavePresetButton {...{savePreset: this.openPresetModal.bind(this), presetSaving}} />
          </div>
        </form>
        {this.modal()}
      </div>
    );
  }
}
