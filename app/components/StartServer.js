import React, { Component, PropTypes } from 'react';
import { Input, Button } from 'react-photonkit';
import styles from './StartServer.css';

export default class StartServer extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    port: PropTypes.number.isRequired,
    serverStarting: PropTypes.bool.isRequired,
    startServer: PropTypes.func.isRequired,
    serverFailMsg: PropTypes.string.isRequired,
    updateAddress: PropTypes.func.isRequired,
    updatePort: PropTypes.func.isRequired
  }

  render () {
    const {address, port, serverStarting, startServer,
           serverFailMsg, updateAddress, updatePort} = this.props;

    let failureMsg;
    if (serverFailMsg) {
      failureMsg = (
        <div className={styles.failureMsg}>
          {serverFailMsg}
        </div>
      );
    } else {
      failureMsg = "";
    }

    return (
      <div className={styles.container}>
        <div className={styles.form}>
          <img src={'../images/appium_logo.png'} className={styles.logo} />
          {failureMsg}
          <form>
            <Input ref="address" type="text" defaultValue={address}
             label="Server Address" onChange={updateAddress} />
            <Input ref="port" type="text" defaultValue={port}
             label="Port" onChange={updatePort} />
            <div className="form-actions">
              <Button form className={styles.startButton} type="submit"
               ptStyle={serverStarting ? "disabled" : "primary"}
               text={serverStarting ? "Starting..." : "Start Server"}
               onClick={startServer}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}
