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
        <form>
          <Input ref="address" type="text" defaultValue={address}
           label="Server Address" />
          <Input ref="port" type="text" defaultValue={port}
           label="Port" />
          <div className="form-actions">
            <Button form type="submit"
             ptStyle="primary" text="Start Server"
             onClick={startServer}
            />
          </div>
        </form>
      </div>
    );
  }
}
