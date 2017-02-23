import React, { Component } from 'react';
//import NewSessionForm from './Session/NewSessionForm';
//import SavedSessions from './Session/SavedSessions';
//import { Tabs, Form, Input, Button, Spin, Card } from 'antd';
//import { UpdaterTypes } from '../actions/Updater';
//import UpdaterStyles from './Updater.css';
import { ipcRenderer } from 'electron';
//import { autoUpdater } from 'electron-updater';

export default class Updater extends Component {

  componentDidMount () {
    ipcRenderer.send('update-info-request');
    this.handleAvailableUpdate = this.handleAvailableUpdate.bind(this);
    ipcRenderer.on('update-info', this.handleAvailableUpdate);
  }

  componentWillUnmount () {
    ipcRenderer.removeListener('update-info', this.handleAvailableUpdate);
  }

  handleAvailableUpdate (e, updateInfo) {
    const { foundAvailableUpdate } = this.props;
    foundAvailableUpdate(updateInfo);
  }

  render () {
    const { updateInfo } = this.props;
    const { releaseDate, releaseNotes, version } = updateInfo;
    return <div>
        <h3>A new version of Appium Desktop is ready: <span>{version}</span> released <span>{releaseDate}</span></h3>
        <h4>Release Notes</h4>
        <p>{releaseNotes}</p>
    </div>;
  }
}
