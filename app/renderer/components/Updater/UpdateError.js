import React, { Component } from 'react';
import { remote, shell } from 'electron';
import { Button } from 'antd';
import UpdaterStyles from './Updater.css';


let latestReleaseUrl = 'https://github.com/appium/appium-desktop/releases/latest';

export default class FoundUpdate extends Component {

  render () {
    const {error} = this.props;
    if (!error) {
      return null;
    }

    return <div className={UpdaterStyles['update-error-container']}>
      <p>Could not download update. Get the latest version at:</p>
      <a href='#' onClick={(e) => e.preventDefault() || shell.openExternal(latestReleaseUrl)}>{latestReleaseUrl}</a>
      <footer>
        <Button onClick={() => remote.getCurrentWindow().close()}>OK</Button>
      </footer>
    </div>;
  }
}
