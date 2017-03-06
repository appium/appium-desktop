import React, { Component } from 'react';
import { Alert, Button } from 'antd';
import { remote } from 'electron';
import UpdaterStyles from './Updater.css';

export default class FoundUpdate extends Component {

  render () {
    const {error} = this.props;
    if (!error) {
      return null;
    }

    return <div className={UpdaterStyles['update-error-container']}>
      <Alert type='error' message={'Could not download update. ' + (error.message || 'Try again later.')} />
      <footer>
        <Button onClick={() => remote.getCurrentWindow().close()}>OK</Button>
      </footer>
    </div>;
  }
}
