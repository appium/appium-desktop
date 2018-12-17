import React, { Component } from 'react';
import { Input } from 'antd';

import { propTypes, updateArg } from './shared';
import StartButton from './StartButton';
import styles from './SimpleTab.css';

export default class SimpleTab extends Component {
  static propTypes = {...propTypes}

  render () {
    const {startServer, serverArgs, serverStarting, serverVersion} = this.props;

    return (
      <div className={styles.form}>
        <form onSubmit={startServer}>
          <Input ref="address" defaultValue={serverArgs.address}
            addonBefore="Host"
            name="address" onChange={updateArg.bind(this)}
            id="simpleHostInput"
          />
          <Input ref="port" defaultValue={serverArgs.port}
            addonBefore="Port" name="port" onChange={updateArg.bind(this)}
            id="simplePortInput"
          />
          <div className="form-actions">
            <StartButton {...{serverStarting, startServer, serverVersion}} />
          </div>
        </form>
      </div>
    );
  }
}
