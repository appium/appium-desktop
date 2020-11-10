import React, { Component } from 'react';
import { Button } from 'antd';
import { ipcRenderer } from 'electron';
import WrongFolderStyles from './WrongFolderStyles.css';
import { withTranslation } from '../../util';
import {
  ExportOutlined
} from '@ant-design/icons';
import { BUTTON } from '../../../../../shared/components/AntdTypes';

class WrongFolder extends Component {
  // This tells the main thread to move this to applications folder which will cause the app to close and restart
  moveToApplicationsFolder () {
    ipcRenderer.send('appium-move-to-applications-folder');
  }

  render () {
    const {t} = this.props;
    return <div className={WrongFolderStyles['wrong-folder']}>
      <div>
        <div>{t('Appium Desktop should be run from the Applications folder')}</div>
        <Button
          size='large'
          icon={<ExportOutlined/>}
          type={BUTTON.PRIMARY}
          onClick={this.moveToApplicationsFolder.bind(this)}>
          {t('Move to Applications Folder')}
        </Button>
      </div>
    </div>;
  }
}

export default withTranslation(WrongFolder);
