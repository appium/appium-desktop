import React, { Component } from 'react';
import { Alert, Button, Progress } from 'antd';
import { ipcRenderer, remote } from 'electron';

export default class DownloadUpdate extends Component {

  render () {
    const {hasDownloadFinished, hasUpdateError, downloadProgress, updateDownloaded, downloadError} = this.props;
    if (!downloadProgress && !updateDownloaded && !downloadError) {
      return null;
    }

    const {bytesPerSecond, percent, total, transferred} = downloadProgress || {};

    return <div>
        {downloadProgress && <Progress percent={!hasDownloadFinished ? percent : 100}></Progress>}
        {updateDownloaded && <p>Download Complete</p>}
        {updateDownloaded && <Button onClick={() => ipcRenderer.send('update-quit-and-install')}>Click to Restart Appium</Button>}

        {hasUpdateError && <div>
          <Alert message="An error has occurred. Try again later" type="error" />
          <Button onClick={() => remote.getCurrentWindow().close()}>OK</Button>
        </div>}
    </div>;
  }
}
