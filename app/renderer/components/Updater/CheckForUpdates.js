import React, { Component } from 'react';
import {  } from 'antd';
import { ipcRenderer } from 'electron';

export default class CheckForUpdates extends Component {

  componentDidMount () {
    ipcRenderer.send('update-info-request');
    this.handleAvailableUpdate = this.handleAvailableUpdate.bind(this);
    this.handleUpdateNotFound = this.handleUpdateNotFound.bind(this);
    ipcRenderer.on('update-info', this.handleAvailableUpdate);
    ipcRenderer.on('update-not-available', this.handleUpdateNotFound);
  }

  componentWillUnmount () {
    ipcRenderer.removeListener('update-info', this.handleAvailableUpdate);
    ipcRenderer.removeListener('update-not-available', this.handleUpdateNotFound);
  }

  handleAvailableUpdate (e, updateInfo) {
    this.props.foundAvailableUpdate(updateInfo);
  }

  handleUpdateNotFound () {
    this.props.foundNoUpdate();
  }

  render () {
    const {isCheckingForUpdate, hasFoundNoUpdate} = this.props;

    if (!isCheckingForUpdate && !hasFoundNoUpdate) {
      return null;
    }

    return <div>
        { isCheckingForUpdate && <span>Checking for updates</span> }
        { hasFoundNoUpdate && <span>Appium is up-to-date</span> }
    </div>;
  }
}
