import React, { Component } from 'react';
import CheckForUpdates from './Updater/CheckForUpdates';
import FoundUpdate from './Updater/FoundUpdate';
import DownloadUpdate from './Updater/DownloadUpdate';
import UpdateError from './Updater/UpdateError';
import { ipcRenderer } from 'electron';

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
    return <div>
      <CheckForUpdates {...this.props} />
      <FoundUpdate {...this.props} />
      <DownloadUpdate {...this.props} />
      <UpdateError {...this.props} />
    </div>;
  }
}
