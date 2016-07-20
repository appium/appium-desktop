import React, { Component, PropTypes } from 'react';
import { Input, Button } from 'react-photonkit';
import styles from './StartServer.css';

export default class StartServer extends Component {
  static propTypes = {
    serverArgs: PropTypes.object.isRequired,
    serverStarting: PropTypes.bool.isRequired,
    startServer: PropTypes.func.isRequired,
    serverFailMsg: PropTypes.string.isRequired,
    updateArgs: PropTypes.func.isRequired,
  }

  updateArg (evt) {
    const {updateArgs} = this.props;
    updateArgs({[evt.target.name]: evt.target.value});
  }

  render () {
    const {serverArgs, serverStarting, startServer,
           serverFailMsg} = this.props;

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
          <form onSubmit={startServer} action="foo">
            <Input ref="address" type="text" defaultValue={serverArgs.address}
             label="Server Address" name="address" onChange={this.updateArg.bind(this)} />
            <Input ref="port" type="text" defaultValue={serverArgs.port}
             label="Port" name="port" onChange={this.updateArg.bind(this)} />
            <div className="form-actions">
              <Button className={styles.startButton} type="button"
               ptStyle={serverStarting ? "disabled" : "primary"}
               text={serverStarting ? "Starting..." : "Start Server"}
               onClick={startServer}
              />
              <input type="submit" hidden={true} />
            </div>
          </form>
        </div>
      </div>
    );
  }
}
