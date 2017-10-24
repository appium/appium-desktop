import React, { Component } from 'react';
import { Button } from 'antd';
import { ipcRenderer } from 'electron';
import WrongFolderStyles from './WrongFolderStyles.css';

export default class WrongFolder extends Component {
  // This tells the main thread to move this to applications folder which will cause the app to close and restart
  moveToApplicationsFolder () {
    ipcRenderer.send('appium-move-to-applications-folder');
  }

  render () {
    return <div className={WrongFolderStyles['wrong-folder']}>
      <div>
        <div>Appium Desktop should be run from the Applications folder</div>
        <Button size='large' icon='export' type="primary" onClick={this.moveToApplicationsFolder.bind(this)}>Move to Applications Folder</Button>
      </div>
    </div>;
  }
}
