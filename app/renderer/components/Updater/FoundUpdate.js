import React, { Component } from 'react';
import { Alert, Button } from 'antd';
import { remote } from 'electron';

export default class FoundUpdate extends Component {

  render () {
    const {updateInfo, requestUpdateDownload, hasUpdateError, hasFoundUpdate} = this.props;

    if (!hasFoundUpdate) {
      return null;
    }

    const {releaseDate, releaseNotes, version} = updateInfo;

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
