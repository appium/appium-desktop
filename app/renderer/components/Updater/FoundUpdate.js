import React, { Component } from 'react';
import { Button } from 'antd';
import { ipcRenderer, remote } from 'electron';
import UpdaterStyles from '../Updater.css';

export default class FoundUpdate extends Component {

  render () {
    const {hasUpdateAvailable, updateInfo} = this.props;

    if (!hasUpdateAvailable) {
      return null;
    }

    const {releaseDate, releaseNotes, version} = updateInfo;

    return <div className={UpdaterStyles['found-updates-container']}>
      <div>
        <h3>A new version of Appium Desktop is available: <span className={UpdaterStyles['release-info']}><span>{version}</span> released <span>{releaseDate}</span></span></h3>
        <textarea value={releaseNotes}></textarea>
      </div>
      <footer>
        <Button type='primary' onClick={() => ipcRenderer.send('update-download')}>Download Update Now</Button>
        <Button onClick={() => remote.getCurrentWindow().close()}>Ask Me Later</Button>
      </footer>
    </div>;
  }
}
