import React, { Component } from 'react';
import { Button, Switch, Input, Modal, Form, Icon, Row, Col, Select } from 'antd';
import { remote } from 'electron';
import FormattedCaps from './FormattedCaps';
import SessionStyles from './Session.css';
const {dialog} = remote;
const {Item: FormItem} = Form;
const {Option} = Select;

export default class NewSessionForm extends Component {

  render () {
    const {cap, onSetCapabilityParam, isEditingDesiredCaps, id} = this.props;

    const buttonAfter = <Icon className={SessionStyles['filepath-button']}
      type="file"
      onClick={() => this.getLocalFilePath((filepath) => onSetCapabilityParam(filepath[0]))} />;

    console.log('*****cap', cap);
    switch (cap.type) {
      case 'text': return <Input disabled={isEditingDesiredCaps} id={id} placeholder='Value' value={cap.value} onChange={(e) => onSetCapabilityParam(e.target.value)} />;
      case 'boolean': return <Switch disabled={isEditingDesiredCaps} id={id} checkedChildren={'true'} unCheckedChildren={'false'}
        placeholder='Value' checked={cap.value} onChange={(value) => onSetCapabilityParam(value)} />;
      case 'number': return <Input disabled={isEditingDesiredCaps} id={id} placeholder='Value' value={cap.value}
        onChange={(e) => !isNaN(parseInt(e.target.value, 10)) ? onSetCapabilityParam(parseInt(e.target.value, 10)) : onSetCapabilityParam(undefined)} />;
      case 'object':
      case 'json_object':
        return <Input disabled={isEditingDesiredCaps} id={id} type='textarea' rows={4} placeholder='Value' value={cap.value}
          onChange={(e) => onSetCapabilityParam(e.target.value)} />;
      case 'file': return <div className={SessionStyles.fileControlWrapper}>
        <Input disabled={isEditingDesiredCaps} id={id} placeholder='Value' value={cap.value} addonAfter={buttonAfter} />
      </div>;

      default:
        throw `Invalid cap type: ${cap.type}`;
    }
  }
}
