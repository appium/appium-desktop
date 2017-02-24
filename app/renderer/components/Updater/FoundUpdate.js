import React, { Component } from 'react';
import { Alert, Button } from 'antd';
import { ipcRenderer, remote } from 'electron';

export default class FoundUpdate extends Component {

  componentDidMount () {
    this.handleDownloadProgress = this.handleDownloadProgress.bind(this);
    this.handleDownloadComplete = this.handleDownloadComplete.bind(this);
    ipcRenderer.on('download-progress', this.handleDownloadProgress);
    ipcRenderer.on('update-download-complete', this.handleDownloadComplete);
  }

  componentWillUnmount () {
    ipcRenderer.removeListener('download-progress', this.handleAvailableUpdate);
    ipcRenderer.removeListener('update-download-complete', this.handleAvailableUpdate);
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
    const {updateInfo, requestUpdateDownload, hasUpdateError, hasFoundUpdate} = this.props;

    const {releaseDate, releaseNotes, version} = updateInfo;

    if (!hasFoundUpdate) {
      return null;
    }

    return <div>
        <h3>A new version of Appium Desktop is ready: <span>{version}</span> released <span>{releaseDate}</span></h3>
        <h4>Release Notes</h4>
        <p>{releaseNotes}</p>
        {!hasUpdateError && <div>
          <Button onClick={requestUpdateDownload}>Download Update Now</Button>
          <Button onClick={() => remote.getCurrentWindow().close()}>Ask Me Later</Button>
        </div>}

        {hasUpdateError && <div>
          <Alert message="An error has occurred. Try again later" type="error" />
          <Button onClick={() => remote.getCurrentWindow().close()}>OK</Button>
        </div>}
    </div>;
  }
}
