import React, { Component } from 'react';
import CheckForUpdates from './Updater/CheckForUpdates';
import FoundUpdate from './Updater/FoundUpdate';
import DownloadUpdate from './Updater/DownloadUpdate';

export default class Updater extends Component {

  render () {
    return <div>
      <CheckForUpdates {...this.props} />
      <FoundUpdate {...this.props} />
      <DownloadUpdate {...this.props} />
    </div>;
  }
}
