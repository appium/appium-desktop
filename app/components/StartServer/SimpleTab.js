import React, { Component } from 'react';
import { Input } from 'react-photonkit';

import { propTypes, updateArg } from './shared';
import StartButton from './StartButton';
import styles from './SimpleTab.css';

export default class SimpleTab extends Component {
  static propTypes = {...propTypes}

  render () {
    const {startServer, serverArgs, serverStarting} = this.props;

    return (
      <div className={styles.form}>
        <form onSubmit={startServer}>
          <Input ref="address" type="text" defaultValue={serverArgs.address}
            label="Server Address" name="address" onChange={updateArg.bind(this)}
          />
          <Input ref="port" type="text" defaultValue={serverArgs.port}
            label="Port" name="port" onChange={updateArg.bind(this)}
          />
          <div className="form-actions">
            <StartButton {...{serverStarting, startServer}} />
          </div>
        </form>
      </div>
    );
  }
}
