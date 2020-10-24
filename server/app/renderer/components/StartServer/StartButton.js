import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { ipcRenderer } from 'electron';
import { withTranslation } from '../../util';
import { SettingOutlined } from '@ant-design/icons';

import styles from './StartButton.css';
import { BUTTON, INPUT } from '../../../../../shared/components/AntdTypes';

class StartButton extends Component {
  isEnabled () {
    return !(this.props.serverStarting || this.props.disabledOverride);
  }

  noop (evt) {
    evt.preventDefault();
  }

  openConfig () {
    ipcRenderer.send('appium-open-config');
  }

  render () {
    const {startServer, serverStarting, serverVersion, t} = this.props;
    const buttonProps = {};
    if (!this.isEnabled()) {
      buttonProps.disabled = true;
    }

    return (
      <div>
        <Button {...buttonProps} id='startServerBtn'
          className={styles.startButton}
          type={BUTTON.PRIMARY}
          onClick={this.isEnabled() ? startServer : this.noop}
        >
          {serverStarting ? t('Starting…') : t('startServer', {serverVersion})}
        </Button>
        <input type={INPUT.SUBMIT} hidden={true} />
        <Button id='configBtn'
          className={styles.configButton}
          onClick={() => this.openConfig()}>
          {t('Edit Configurations')}<SettingOutlined />
        </Button>
      </div>
    );
  }
}

StartButton.propTypes = {
  serverStarting: PropTypes.bool.isRequired,
  startServer: PropTypes.func.isRequired,
  disabledOverride: PropTypes.bool,
};

export default withTranslation(StartButton);
