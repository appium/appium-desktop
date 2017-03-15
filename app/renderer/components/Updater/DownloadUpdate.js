import React, { Component } from 'react';
import { Button, Progress } from 'antd';
import { ipcRenderer } from 'electron';
import UpdaterStyles from './Updater.css';

export default class DownloadUpdate extends Component {

  render () {
    const {downloadProgress, updateDownloaded, downloadError} = this.props;
    if (!downloadProgress && !updateDownloaded && !downloadError) {
      return null;
    }

    let {bytesPerSecond = 0, percent, total, transferred} = downloadProgress || {};

    const megaBytesPerSecond = Math.round((bytesPerSecond / 1000000) * 100) / 100;
    const megaBytesTransferred = Math.round((transferred / 1000000) * 100) / 100;
    const megaBytesTotal = Math.round((total / 1000000) * 100) / 100;
    percent = Math.round(percent);


    return <div className={UpdaterStyles['download-updates-container']}>
      <p>
        {!updateDownloaded && <span>Downloading: {megaBytesPerSecond ? megaBytesPerSecond : '-'} bps</span>}
        {!updateDownloaded && <span>&nbsp;(transferred: {megaBytesTransferred || 0} / {megaBytesTotal || '-'} mb)</span>}
        {updateDownloaded && <span>Download Complete</span>}
      </p>
      <Progress percent={!updateDownloaded ? percent : 100}></Progress>
      {updateDownloaded && <Button type='primary' onClick={() => ipcRenderer.send('update-quit-and-install')}>Click to Restart Appium</Button>}
    </div>;
  }
}
