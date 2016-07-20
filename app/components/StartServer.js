import React, { Component, PropTypes } from 'react';
import { Input, Button } from 'react-photonkit';
import styles from './StartServer.css';

export default class StartServer extends Component {
  static propTypes = {
    serverArgs: PropTypes.object.isRequired,
    serverStarting: PropTypes.bool.isRequired,
    startServer: PropTypes.func.isRequired,
    updateArgs: PropTypes.func.isRequired,
  }

  updateArg (evt) {
    const {updateArgs} = this.props;
    updateArgs({[evt.target.name]: evt.target.value});
  }

  render () {
    const {serverArgs, serverStarting, startServer} = this.props;

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
          <div className={styles.form}>
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
      </div>
    );
  }
}
