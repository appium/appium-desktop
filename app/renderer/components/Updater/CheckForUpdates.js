import React, { Component } from 'react';
import {  } from 'antd';

export default class CheckForUpdates extends Component {

  render () {
    const {isCheckingForUpdates, hasNoUpdateAvailable} = this.props;

    if (!isCheckingForUpdates && !hasNoUpdateAvailable) {
      return null;
    }

    return <div>
        { isCheckingForUpdates && <span>Checking for updates</span> }
        { hasNoUpdateAvailable && <span>Appium is up-to-date</span> }
    </div>;
  }
}
