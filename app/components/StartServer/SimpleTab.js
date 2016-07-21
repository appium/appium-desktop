import React, { Component, PropTypes } from 'react';
import { Input, Button } from 'react-photonkit';

import styles from './SimpleTab.css';
import parentStyles from './StartServer.css';

export default class SimpleTab extends Component {
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
    const {startServer, serverArgs, serverStarting} = this.props;

    return (
      <div className={styles.form}>
        <form onSubmit={startServer} action="foo">
          <Input ref="address" type="text" defaultValue={serverArgs.address}
           label="Server Address" name="address" onChange={this.updateArg.bind(this)} />
          <Input ref="port" type="text" defaultValue={serverArgs.port}
           label="Port" name="port" onChange={this.updateArg.bind(this)} />
          <div className="form-actions">
            <Button className={parentStyles.startButton} type="button"
             ptStyle={serverStarting ? "disabled" : "primary"}
             text={serverStarting ? "Starting..." : "Start Server"}
             onClick={startServer}
            />
            <input type="submit" hidden={true} />
          </div>
        </form>
      </div>
    );
  }
}
