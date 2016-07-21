import React, { Component, PropTypes } from 'react';
import { Button } from 'react-photonkit';

import SimpleTab from './SimpleTab';
import styles from './StartServer.css';

export default class StartServer extends Component {
  static propTypes = {
    serverArgs: PropTypes.object.isRequired,
    serverStarting: PropTypes.bool.isRequired,
    startServer: PropTypes.func.isRequired,
    updateArgs: PropTypes.func.isRequired,
  }

  render () {
    return (
      <div className={styles.container}>
        <div className={styles.formAndLogo}>
          <img src={'../images/appium_logo.png'} className={styles.logo} />
          <div className={styles.tabs}>
            <div className={`btn-group ${styles.tabButtons}`}>
              <Button text="Simple" ptStyle="primary" />
              <Button text="Advanced" />
              <Button text="Presets" />
            </div>
          </div>
          <SimpleTab {...this.props} />
        </div>
      </div>
    );
  }
}
