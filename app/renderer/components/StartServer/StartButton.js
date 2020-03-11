import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { ipcRenderer } from 'electron';
import { withTranslation } from '../../util';
import LegacyIcon from '@ant-design/icons';

import styles from './StartButton.css';

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
          type="primary"
          onClick={this.isEnabled() ? startServer : this.noop}
        >
          {serverStarting ? t('Starting…') : t('startServer', {serverVersion})}
        </Button>
        <input type="submit" hidden={true} />
        <Button id='configBtn'
          className={styles.configButton}
          onClick={() => this.openConfig()}>
          {t('Edit Configurations')}<LegacyIcon type="setting" />
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
