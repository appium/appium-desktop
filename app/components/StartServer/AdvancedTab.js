import React, { Component } from 'react';
import { Button } from 'react-photonkit';
import Modal from 'react-modal';

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
      presetSaveComplete: false,
    };
  }

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

  openPresetModal () {
    this.setState({
      modalOpen: true,
      presetSaveComplete: false,
    });
  }

  closePresetModal () {
    this.setState({modalOpen: false});
  }

  updatePresetName (evt) {
    this.setState({newPresetName: evt.target.value});
  }

  savePreset (evt) {
    evt.preventDefault();
    if (!this.state.newPresetName) {
      // don't save a preset without a name
      return;
    }
    this.props.savePreset(this.state.newPresetName, this.props.serverArgs);
    this.setState({presetSaveComplete: true});
    setTimeout(() => {
      this.setState({modalOpen: false});
    }, 1000);
  }

  modal () {
    const form = (
      <div>
        <h3 className={styles.savePresetTitle}>Save Server Arguments Preset</h3>
        <form className={styles.input}
         onSubmit={this.savePreset.bind(this)}>
          <label>Preset name:</label>
          <input autoFocus
            className={"form-control"}
            ref="presetName"
            type="text"
            name={"presetName"}
            onChange={this.updatePresetName.bind(this)}
          />
          <input type="submit" hidden={true} />
        </form>
        <div className={styles.presetActions}>
          <Button
           type="button"
           ptStyle="default"
           text="Cancel"
           onClick={this.closePresetModal.bind(this)}
          />
          <Button
           type="button"
           ptStyle="primary"
           text="Save"
           onClick={this.savePreset.bind(this)}
          />
        </div>
      </div>
    );

    const success = (
      <div className={styles.savePresetSuccess}>Saved</div>
    );

    return (
      <Modal isOpen={this.state.modalOpen} className={styles.presetModal}>
      {this.state.presetSaveComplete ? success : form}
      </Modal>
    );
  }

  render () {
    const {startServer, serverStarting, presetSaving} = this.props;

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
            <SavePresetButton {...{savePreset: this.openPresetModal.bind(this), presetSaving}} />
          </div>
        </form>
        {this.modal()}
      </div>
    );
  }
}
