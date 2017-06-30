import React, { Component, PropTypes } from 'react';
import { Button } from 'antd';

import styles from './StartButton.css';

export default class StartButton extends Component {
  static propTypes = {
    serverStarting: PropTypes.bool.isRequired,
    startServer: PropTypes.func.isRequired,
    disabledOverride: PropTypes.bool,
  }

  isEnabled () {
    return !(this.props.serverStarting || this.props.disabledOverride);
  }

  noop (evt) {
    evt.preventDefault();
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
      </div>
    );
  }
}
