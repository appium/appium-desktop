import React, { Component, PropTypes } from 'react';
import { Button } from 'react-photonkit';

import styles from './StartButton.css';

export default class StartButton extends Component {
  static propTypes = {
    serverStarting: PropTypes.bool.isRequired,
    startServer: PropTypes.func.isRequired,
  }

  render () {
    const {startServer, serverStarting} = this.props;

    return (
      <div>
        <Button className={styles.startButton} type="button"
         ptStyle={serverStarting ? "disabled" : "primary"}
         text={serverStarting ? "Starting..." : "Start Server"}
         onClick={startServer}
        />
        <input type="submit" hidden={true} />
      </div>
    );
  }
}
