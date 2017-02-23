import React, { Component } from 'react';
import { Button, Progress } from 'antd';
import { ipcRenderer } from 'electron';

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
    const {updateInfo, requestUpdateDownload, hasDownloadStarted, hasDownloadFinished, downloadProgress} = this.props;

    const { releaseDate, releaseNotes, version } = updateInfo;
    const { bytesPerSecond, percent, total } = downloadProgress;

    return <div>
        <h3>A new version of Appium Desktop is ready: <span>{version}</span> released <span>{releaseDate}</span></h3>
        <h4>Release Notes</h4>
        <p>{releaseNotes}</p>
        {hasDownloadStarted && <Progress percent={!hasDownloadFinished ? percent : 100}></Progress>}
        {!hasDownloadStarted && <Button onClick={requestUpdateDownload}>{'Download Update Now'}</Button>}
        {!hasDownloadStarted && <Button>Ask Me Later</Button>}
        {hasDownloadStarted && !hasDownloadFinished && <Button onClick={requestUpdateDownload} disabled>{ 'Downloading'}</Button>}
        {hasDownloadFinished && <p>Download Complete</p>}
        {hasDownloadFinished && <Button onClick={() => ipcRenderer.send('update-quit-and-install')}>Click to Restart Appium</Button>}
    </div>;
  }
}
