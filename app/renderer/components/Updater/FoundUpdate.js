import React, { Component } from 'react';
import { Alert, Button } from 'antd';
import { ipcRenderer, remote } from 'electron';

export default class FoundUpdate extends Component {

  render () {
    const {hasUpdateAvailable, updateInfo, hasUpdateError} = this.props;

    if (!hasUpdateAvailable) {
      return null;
    }

    const {releaseDate, releaseNotes, version} = updateInfo;

    return <div>
        <h3>A new version of Appium Desktop is ready: <span>{version}</span> released <span>{releaseDate}</span></h3>
        <h4>Release Notes</h4>
        <p>{releaseNotes}</p>
        {!hasUpdateError && <div>
          <Button onClick={() => ipcRenderer.send('update-download')}>Download Update Now</Button>
          <Button onClick={() => remote.getCurrentWindow().close()}>Ask Me Later</Button>
        </div>}

        {hasUpdateError && <div>
          <Alert message="An error has occurred. Try again later" type="error" />
          <Button onClick={() => remote.getCurrentWindow().close()}>OK</Button>
        </div>}
    </div>;
  }
}
