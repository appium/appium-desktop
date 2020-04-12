import React, { Component } from 'react';
import { Switch, Input } from 'antd';
import SessionStyles from './Session.css';
import { remote } from 'electron';
import { FileOutlined } from '@ant-design/icons';
import { INPUT } from '../AntdTypes';

const {dialog} = remote;


export default class NewSessionForm extends Component {

  getLocalFilePath (success) {
    dialog.showOpenDialog((filepath) => {
      if (filepath) {
        success(filepath);
      }
    });
    this.handleSetType = this.handleSetType.bind(this);
  }

  render () {
    const {cap, onSetCapabilityParam, isEditingDesiredCaps, id, t} = this.props;

    const buttonAfter = <FileOutlined
      className={SessionStyles['filepath-button']}
      onClick={() => this.getLocalFilePath((filepath) => onSetCapabilityParam(filepath[0]))} />;

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
        <Input disabled={isEditingDesiredCaps} id={id} placeholder={t('Value')} value={cap.value} addonAfter={buttonAfter} />
      </div>;

      default:
        throw `Invalid cap type: ${cap.type}`;
    }
  }
}
