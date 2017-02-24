import React, { Component } from 'react';
import { Alert, Button, Progress } from 'antd';
import { ipcRenderer, remote } from 'electron';

export default class DownloadUpdate extends Component {

  render () {
    const {requestUpdateDownload, hasDownloadStarted, hasDownloadFinished, hasUpdateError} = this.props;

    if (!hasDownloadStarted) {
      return null;
    }

    return <div>
        <h3>A new version of Appium Desktop is ready: <span>{version}</span> released <span>{releaseDate}</span></h3>
        <h4>Release Notes</h4>
        {!hasUpdateError && <div>
          {!hasDownloadStarted && <Button onClick={requestUpdateDownload}>Download Update Now</Button>}
          {!hasDownloadStarted && <Button onClick={() => remote.getCurrentWindow().close()}>Ask Me Later</Button>}
          {hasDownloadStarted && <Progress percent={!hasDownloadFinished ? percent : 100}></Progress>}
          {hasDownloadStarted && !hasDownloadFinished && <Button onClick={requestUpdateDownload} disabled>Downloading</Button>}
          {hasDownloadFinished && <p>Download Complete</p>}
          {hasDownloadFinished && <Button onClick={() => ipcRenderer.send('update-quit-and-install')}>Click to Restart Appium</Button>}
        </div>}

        {hasUpdateError && <div>
          <Alert message="An error has occurred. Try again later" type="error" />
          <Button onClick={() => remote.getCurrentWindow().close()}>OK</Button>
        </div>}
    </div>;
  }
}
