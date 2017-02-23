import React, { Component } from 'react';
//import NewSessionForm from './Session/NewSessionForm';
//import SavedSessions from './Session/SavedSessions';
import { Button, Progress } from 'antd';
//import { UpdaterTypes } from '../actions/Updater';
//import UpdaterStyles from './Updater.css';
import { ipcRenderer } from 'electron';
//import { autoUpdater } from 'electron-updater';

export default class Updater extends Component {

  componentDidMount () {
    ipcRenderer.send('update-info-request');
    this.handleAvailableUpdate = this.handleAvailableUpdate.bind(this);
    this.handleDownloadProgress = this.handleDownloadProgress.bind(this);
    this.handleDownloadComplete = this.handleDownloadComplete.bind(this);
    ipcRenderer.on('update-info', this.handleAvailableUpdate);
    ipcRenderer.on('download-progress', this.handleDownloadProgress);
    ipcRenderer.on('update-download-complete', this.handleDownloadComplete);
  }

  componentWillUnmount () {
    ipcRenderer.removeListener('update-info', this.handleAvailableUpdate);
  }

  handleAvailableUpdate (e, updateInfo) {
    const {foundAvailableUpdate} = this.props;
    foundAvailableUpdate(updateInfo);
  }

  handleDownloadProgress (e, downloadProgress) {
    const {downloadProgressed} = this.props;
    downloadProgressed(downloadProgress);
  }

  handleDownloadComplete () {
    const {downloadCompleted} = this.props;
    downloadCompleted();
  }

  render () {
    const {updateInfo, requestUpdateDownload, isDownloading, isDownloaded, downloadProgress} = this.props;

    const { releaseDate, releaseNotes, version } = updateInfo;
    const { bytesPerSecond, percent, total } = downloadProgress;

    return <div>
        <h3>A new version of Appium Desktop is ready: <span>{version}</span> released <span>{releaseDate}</span></h3>
        <h4>Release Notes</h4>
        <p>{releaseNotes}</p>
        {isDownloading && <Progress percent={percent}></Progress>}
        {!isDownloaded && <Button onClick={requestUpdateDownload} disabled={isDownloading}>{isDownloading ? 'Downloading' : 'Download Update Now'}</Button>}
        {!isDownloaded && <Button>Ask Me Later</Button>}
        {isDownloaded && <p>Download Complete</p>}
        {isDownloaded && <Button>Click to Restart Appium</Button>}
    </div>;
  }
}
