import React, { Component, PropTypes } from 'react';
import { Button } from 'react-photonkit';

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
    const {startServer, serverStarting, disabledOverride} = this.props;

    return (
      <div>
        <Button className={styles.startButton} type="button"
         ptStyle={!this.isEnabled() ? "disabled" : "primary"}
         text={serverStarting ? "Starting..." : "Start Server"}
         onClick={this.isEnabled() ? startServer : this.noop}
        />
        <input type="submit" hidden={true} />
      </div>
    );
  }
}
