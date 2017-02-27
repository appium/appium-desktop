import React, { Component } from 'react';
import { Button, Progress } from 'antd';
import { ipcRenderer } from 'electron';
import UpdaterStyles from '../Updater.css';

export default class DownloadUpdate extends Component {

  render () {
    const {hasDownloadFinished, downloadProgress, updateDownloaded, downloadError} = this.props;
    if (!downloadProgress && !updateDownloaded && !downloadError) {
      return null;
    }

    const {bytesPerSecond, percent, total, transferred} = downloadProgress || {};

    return <div className={UpdaterStyles['download-updates-container']}>
      {!updateDownloaded && <p>
        <span>Downloading: {Math.round(bytesPerSecond * 100) / 100} bps</span>
        <span>&nbsp;(transferred: {transferred} / {total} bytes)</span>
      </p>}
      {downloadProgress && <Progress percent={!hasDownloadFinished ? percent : 100}></Progress>}
      {updateDownloaded && <p>Download Complete</p>}
      {updateDownloaded && <Button type='primary' onClick={() => ipcRenderer.send('update-quit-and-install')}>Click to Restart Appium</Button>}
    </div>;
  }
}
