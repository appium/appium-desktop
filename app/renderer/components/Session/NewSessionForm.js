import React, { Component } from 'react';
import { Button, Switch, Input, Modal, Form, Icon, Row, Col, Select, notification } from 'antd';
import { remote } from 'electron';
import FormattedCaps from './FormattedCaps';
import SessionStyles from './Session.css';
const {dialog} = remote;
const {Item:FormItem} = Form;
const {Option} = Select;

export default class NewSessionForm extends Component {

  getLocalFilePath (success) {
    dialog.showOpenDialog((filepath) => {
      if (filepath) {
        success(filepath);
      }
    });
    this.handleSetType = this.handleSetType.bind(this);
  }

  getCapsControl (cap, index) {
    const {setCapabilityParam, isEditingDesiredCaps} = this.props;

    const buttonAfter = <Icon className={SessionStyles['filepath-button']}
      type="file"
      onClick={() => this.getLocalFilePath((filepath) => setCapabilityParam(index, 'value', filepath[0]))} />;

    switch (cap.type) {
      case 'text': return <Input disabled={isEditingDesiredCaps} id={`desiredCapabilityValue_${index}`} placeholder='Value' value={cap.value} onChange={(e) => setCapabilityParam(index, 'value', e.target.value)} size="large"/>;
      case 'boolean': return <Switch disabled={isEditingDesiredCaps} id={`desiredCapabilityValue_${index}`} checkedChildren={'true'} unCheckedChildren={'false'}
        placeholder='Value' checked={cap.value} onChange={(value) => setCapabilityParam(index, 'value', value)} />;
      case 'number': return <Input disabled={isEditingDesiredCaps} id={`desiredCapabilityValue_${index}`} placeholder='Value' value={cap.value}
        onChange={(e) => !isNaN(parseInt(e.target.value, 10)) ? setCapabilityParam(index, 'value', parseInt(e.target.value, 10)) : setCapabilityParam(index, 'value', undefined)} size="large"/>;
      case 'object':
      case 'json_object':
        return <Input disabled={isEditingDesiredCaps} id={`desiredCapabilityValue_${index}`} type='textarea' rows={4} placeholder='Value' value={cap.value}
          onChange={(e) => setCapabilityParam(index, 'value', e.target.value)} size="large"/>;
      case 'file': return <div className={SessionStyles.fileControlWrapper}>
        <Input disabled={isEditingDesiredCaps} id={`desiredCapabilityValue_${index}`} placeholder='Value' value={cap.value} addonAfter={buttonAfter} size="large"/>
      </div>;

      default:
        throw `Invalid cap type: ${cap.type}`;
    }
  }

  /**
   * Callback when the type of a dcap is changed
   */
  handleSetType (index, type) {
    let {setCapabilityParam, caps} = this.props;
    setCapabilityParam(index, 'type', type);

    // Translate the current value to the new type
    let translatedValue = caps[index].value;
    switch (type) {
      case 'text':
        translatedValue = translatedValue + '';
        break;
      case 'boolean':
        if (translatedValue === 'true') {
          translatedValue = true;
        } else if (translatedValue === 'false') {
          translatedValue = false;
        } else {
          translatedValue = !!translatedValue;
        }
        break;
      case 'number':
        translatedValue = parseInt(translatedValue, 10) || 0;
        break;
      case 'json_object':
      case 'object':
        translatedValue = translatedValue + '';
        break;
      case 'file':
        translatedValue = '';
        break;
      default:
        break;
    }
    setCapabilityParam(index, 'value', translatedValue);
  }

  render () {
    const {setCapabilityParam, caps, addCapability, removeCapability, saveSession, hideSaveAsModal, saveAsText, showSaveAsModal, setSaveAsText, isEditingDesiredCaps} = this.props;

    return <div>
      <Row type="flex" align="top" justify="start" className={SessionStyles.capsFormRow}>
      <Col order={1} className={`${SessionStyles.capsFormCol} ${isEditingDesiredCaps ? SessionStyles.capsFormDisabled : ''}`}>
        <Form inline>
          {caps.map((cap, index) => {
            return <div key={index} className={SessionStyles['desired-capabilities-form-container']}>
              <FormItem>
                <Input disabled={isEditingDesiredCaps} id={`desiredCapabilityName_${index}`} placeholder='Name' value={cap.name} onChange={(e) => setCapabilityParam(index, 'name', e.target.value)}/>
              </FormItem>
              <FormItem>
                <Select disabled={isEditingDesiredCaps} onChange={(val) => this.handleSetType(index, val)} defaultValue={cap.type} size="large" style={{width: 120}}>
                  <Option value='text'>text</Option>
                  <Option value='boolean'>boolean</Option>
                  <Option value='number'>number</Option>
                  <Option value='object'>JSON object</Option>
                  <Option value='file'>filepath</Option>
                </Select>
              </FormItem>
              <FormItem className={SessionStyles.capsValueControl}>
                {this.getCapsControl(cap, index)}
              </FormItem>
              <FormItem>
                <Button {...{disabled: caps.length <= 1 || isEditingDesiredCaps}} icon='delete' onClick={() => removeCapability(index)}/>
              </FormItem>
            </div>;
          })}
          <div className={SessionStyles.capsFormLastRow}>
            <FormItem>
              <Button disabled={isEditingDesiredCaps} id='btnAddDesiredCapability' icon='plus' onClick={addCapability} className={SessionStyles['add-desired-capability-button']} />
            </FormItem>
          </div>
        </Form>
      </Col>

      <Col order={2} className={SessionStyles.capsFormattedCol}>
        <FormattedCaps {...this.props} />
        <Modal visible={showSaveAsModal}
          title='Save Capability Set As...'
          okText='Save'
          cancelText='Cancel'
          onCancel={hideSaveAsModal}
          onOk={() => saveSession(caps, {name: saveAsText})}>
          <Input onChange={(e) => setSaveAsText(e.target.value)} addonBefore='Name' value={saveAsText}/>
        </Modal>
      </Col>
      </Row>
    </div>;
  }
}
