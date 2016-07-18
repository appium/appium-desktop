import React, { Component, PropTypes } from 'react';
import { Input, Button } from 'react-photonkit';
import styles from './StartServer.css';

export default class StartServer extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    port: PropTypes.number.isRequired,
    startServer: PropTypes.func.isRequired
  }

  render () {
    const {address, port, startServer} = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.form}>
          <img src={'../images/appium_logo.png'} className={styles.logo} />
          <form>
            <Input ref="address" type="text" defaultValue={address}
             label="Server Address" />
            <Input ref="port" type="text" defaultValue={port}
             label="Port" />
            <div className="form-actions">
              <Button form className={styles.startButton} type="submit"
               ptStyle="primary" text="Start Server"
               onClick={startServer}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}
