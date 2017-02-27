import React, { Component } from 'react';
import {  } from 'antd';
import UpdaterStyles from '../Updater.css';
import AppiumLogo from '../../images/appium_logo.png';
import { version } from '../../../../package.json';

export default class CheckForUpdates extends Component {

  render () {
    const {isCheckingForUpdates, hasNoUpdateAvailable} = this.props;

    if (!isCheckingForUpdates && !hasNoUpdateAvailable) {
      return null;
    }

    return <div className={UpdaterStyles['check-for-updates-container']}>
      <div>
        <img src={AppiumLogo} />
        <p>Version: {version}</p>
      </div>
      <footer>
      { isCheckingForUpdates && <span>Checking for updates</span> }
      { hasNoUpdateAvailable && <span>Appium is up-to-date</span> }
      </footer>
    </div>;
  }
}
