import React, { Component } from 'react';
import CheckForUpdates from './CheckForUpdates';
import FoundUpdate from './FoundUpdate';
import DownloadUpdate from './DownloadUpdate';
import UpdateError from './UpdateError';
import { ipcRenderer } from 'electron';
import UpdaterStyles from './Updater.css';

export default class Updater extends Component {

  componentDidMount () {
    ipcRenderer.send('update-state-request');
    this.handleUpdateStateChange = this.handleUpdateStateChange.bind(this);
    ipcRenderer.on('update-state-change', this.handleUpdateStateChange);
  }

  handleUpdateStateChange (e, state) {
    this.props.setUpdateState(state);
  }

  render () {
    return <div className={UpdaterStyles['updater-container']}>
      <CheckForUpdates {...this.props} />
      <FoundUpdate {...this.props} />
      <DownloadUpdate {...this.props} />
      <UpdateError {...this.props} />
    </div>;
  }
}
