import React, { Component } from 'react';
import {Modal, Input, Checkbox, notification, Tooltip} from 'antd';

import { withTranslation } from '../../util';
import { propTypes, updateArg } from './shared';
import StartButton from './StartButton';
import SavePresetButton from './SavePresetButton';
import styles from './AdvancedTab.css';
import { INPUT } from '../AntdTypes';

// args we build a UI for:
// ipa, address, port, callbackAddress, callbackPort,
// bootstrapPort, backendRetries, sessionOverride, log,
// logLevel, logTimestamp, localTimezone, logNoColors,
// defaultDevice, automationTraceTemplatePath, instrumentsPath,
// nodeconfig, robotAddress, robotPort, selendroidPort,
// chromeDriverPort, chromedriverExecutable, enforceStrictCaps,
// isolateSimDevice, tmpDir, traceDir, debugLogSpacing, allowCors,
// suppressAdbKillServer, webkitDebugProxyPort, defaultCapabilities

class AdvancedTab extends Component {

  constructor (props) {
    super(props);
    this.state = {
      modalOpen: false,
      newPresetName: '',
    };
  }

  buildInput (argName, type, label) {
    const {serverArgs, t} = this.props;

    if (type === 'text') {
      return (
        <div className={styles.input}>
          <Input ref={argName} type={INPUT.TEXT}
            defaultValue={serverArgs[argName]}
            name={argName} onChange={updateArg.bind(this)}
            addonBefore={label}
          />
        </div>
      );
    }

    if (type === 'checkbox') {
      return (
        <div className={styles.input}>
          <Checkbox ref={argName}
            name={argName} defaultChecked={serverArgs[argName]}
            onChange={updateArg.bind(this)}
          >{label}</Checkbox>
        </div>
      );
    }

    if (type === 'textarea') {
      return '';
    }

    throw new Error(t('invalidType', {type}));
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
    const {t} = this.props;
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
      message: t('Saved'),
      description: t('presetAdded', {presetName: this.state.newPresetName})
    });
    this.setState({modalOpen: false});
  }

  modal () {
    const {t} = this.props;
    const form = (
      <div>
        <form className={styles.input}
          onSubmit={this.savePreset.bind(this)}>
          <Input autoFocus
            ref="presetName"
            name={'presetName'}
            addonBefore={t('Preset name')}
            onChange={this.updatePresetName.bind(this)}
            size="large"
          />
          <input type={INPUT.SUBMIT} hidden={true} />
        </form>
      </div>
    );

    return (
      <Modal
        visible={this.state.modalOpen}
        className={styles.presetModal}
        title={t('Save Server Arguments Preset')}
        width={340}
        okText={t('Save')}
        onOk={this.savePreset.bind(this)}
        cancelText={t('Cancel')}
        onCancel={this.closePresetModal.bind(this)}
      >
        {form}
      </Modal>
    );
  }

  render () {
    const {startServer, serverStarting, presetSaving, serverVersion, t} = this.props;

    return (
      <div className={styles.advancedForm}>
        <form onSubmit={startServer}>
          <div className={styles.inputSection}>
            <div className={styles.secTitle}>{t('General')}</div>
            <div className={styles.secBody}>
              {this.buildInput('address', 'text', t('Server Address'))}
              {this.buildInput('port', 'text', t('Server Port'))}
              {this.buildInput('log', 'text', t('Logfile Path'))}
              {this.buildInput('loglevel', 'text', t('Log Level'))}
              {this.buildInput('tmpDir', 'text', t('Override Temp Path'))}
              {this.buildInput('nodeconfig', 'text', t('Node Config File Path'))}
              {this.buildInput('localTimezone', 'checkbox', t('Local Timezone'))}
              {this.buildInput('sessionOverride', 'checkbox', t('Allow Session Override'))}
              {this.buildInput('logTimestamp', 'checkbox', t('Log Timestamps'))}
              {this.buildInput('logNoColors', 'checkbox', t('Suppress Log Color'))}
              {this.buildInput('enforceStrictCaps', 'checkbox', t('Strict Caps Mode'))}
              <Tooltip title={t('relaxedSecurityInfo')}>
                {this.buildInput('relaxedSecurityEnabled', 'checkbox', t('Relaxed Security'))}
              </Tooltip>
              {this.buildInput('allowCors', 'checkbox', t('Allow CORS'))}
              {this.buildInput('defaultCapabilities', 'textarea', t('Default Capabilities'))}
            </div>

            <div className={styles.secTitle}>{t('iOS')}</div>
            <div className={styles.secBody}>
              {this.buildInput('wdaLocalPort', 'text', t('WebDriverAgent Port'))}
              {this.buildInput('callbackHost', 'text', t('executeAsync Callback Host'))}
              {this.buildInput('callbackPort', 'text', t('executeAsync Callback Port'))}
            </div>

            <div className={styles.secTitle}>{t('Android')}</div>
            <div className={styles.secBody}>
              {this.buildInput('bootstrapPort', 'text', t('Bootstrap Port'))}
              {this.buildInput('selendroidPort', 'text', t('Selendroid Port'))}
              {this.buildInput('chromeDriverPort', 'text', t('Chromedriver Port'))}
              {this.buildInput('chromedriverExecutable', 'text', t('Chromedriver Binary Path'))}
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

AdvancedTab.propTypes = {...propTypes};

export default withTranslation(AdvancedTab);
