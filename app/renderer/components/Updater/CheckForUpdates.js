import React, { Component } from 'react';
import {  } from 'antd';
import { ipcRenderer } from 'electron';

export default class CheckForUpdates extends Component {

  componentDidMount () {
    ipcRenderer.send('update-info-request');
    this.handleAvailableUpdate = this.handleAvailableUpdate.bind(this);
    ipcRenderer.on('update-info', this.handleAvailableUpdate);
  }

  componentWillUnmount () {
    ipcRenderer.removeListener('update-info', this.handleAvailableUpdate);
  }

  handleAvailableUpdate (e, updateInfo) {
    const {foundAvailableUpdate} = this.props;
    foundAvailableUpdate(updateInfo);
  }

  render () {
    const {isCheckingForUpdate, hasFoundNoUpdate} = this.props;

    if (!isCheckingForUpdate && !hasFoundNoUpdate) {
      return null;
    }

    return <div>
        { isCheckingForUpdate && <span>Checking for updates</span> }
    </div>;
  }
}
