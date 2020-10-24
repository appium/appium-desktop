import React, { Component } from 'react';
import { Switch, Input } from 'antd';
import SessionStyles from './Session.css';
import { remote } from 'electron';
import { FileOutlined } from '@ant-design/icons';
import { INPUT } from '../AntdTypes';
import _ from 'lodash';
import log from 'electron-log';

const {dialog} = remote;

export default class NewSessionForm extends Component {

  async getLocalFilePath () {
    try {
      const {canceled, filePaths} = await dialog.showOpenDialog({properties: ['openFile']});
      if (!canceled && !_.isEmpty(filePaths)) {
        return filePaths[0];
      }
    } catch (e) {
      log.error(e);
    }
  }

  render () {
    const {cap, onSetCapabilityParam, isEditingDesiredCaps, id, t} = this.props;

    const buttonAfter = (currentFilePath) => <FileOutlined
      className={SessionStyles['filepath-button']}
      onClick={async () => {onSetCapabilityParam(await this.getLocalFilePath() || currentFilePath);}} />;

    switch (cap.type) {
      case 'text': return <Input disabled={isEditingDesiredCaps} id={id} placeholder={t('Value')} value={cap.value} onChange={(e) => onSetCapabilityParam(e.target.value)} />;
      case 'boolean': return <Switch disabled={isEditingDesiredCaps} id={id} checkedChildren={'true'} unCheckedChildren={'false'}
        placeholder={t('Value')} checked={cap.value} onChange={(value) => onSetCapabilityParam(value)} />;
      case 'number': return <Input disabled={isEditingDesiredCaps} id={id} placeholder={t('Value')} value={cap.value}
        onChange={(e) => !isNaN(parseInt(e.target.value, 10)) ? onSetCapabilityParam(parseInt(e.target.value, 10)) : onSetCapabilityParam(undefined)} />;
      case 'object':
      case 'json_object':
        return <Input disabled={isEditingDesiredCaps} id={id} type={INPUT.TEXTAREA} rows={4} placeholder={t('Value')} value={cap.value}
          onChange={(e) => onSetCapabilityParam(e.target.value)} />;
      case 'file': return <div className={SessionStyles.fileControlWrapper}>
        <Input disabled={isEditingDesiredCaps} id={id} placeholder={t('Value')} value={cap.value} addonAfter={buttonAfter(cap.value)} />
      </div>;

      default:
        throw `Invalid cap type: ${cap.type}`;
    }
  }
}
