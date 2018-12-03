import React, { Component, PropTypes } from 'react';
import { Button, Icon } from 'antd';
import { ipcRenderer } from 'electron';

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
    const {startServer, serverStarting, serverVersion} = this.props;
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
          {serverStarting ? "Starting..." : `Start Server v${serverVersion}`}
        </Button>
        <input type="submit" hidden={true} />
        <Button id='configBtn'
          className={styles.configButton}
          onClick={() => this.openConfig()}>
          Edit Configurations! <Icon type="setting" />
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

if (module.hot) {
  const { hot } = require('react-hot-loader');
  module.exports = hot(module)(StartButton);
} else {
  module.exports = StartButton;
}
