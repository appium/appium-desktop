import React, { Component } from 'react';
import { Button, Switch, Input, InputNumber, Modal, Form, Icon, Row, Col } from 'antd';
import { remote } from 'electron';
import FormattedCaps from './FormattedCaps';
import SessionStyles from '../Session.css';
const {dialog} = remote;
const FormItem = Form.Item;

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
    const {setCapabilityParam} = this.props;

    const buttonAfter = <Icon className={SessionStyles['filepath-button']}
      type="file" 
      onClick={() => this.getLocalFilePath((filepath) => setCapabilityParam(index, 'value', filepath))} />;

    switch (cap.type) {
      case 'text': return <Input placeholder='Value' value={cap.value} onChange={(e) => setCapabilityParam(index, 'value', e.target.value)}/>;
      case 'boolean': return <Switch checkedChildren={'true'} unCheckedChildren={'false'} 
        placeholder='Value' checked={cap.value} onChange={(value) => setCapabilityParam(index, 'value', value)}/>;
      case 'number': return <Input placeholder='Value' value={cap.value} 
        onChange={(e) => !isNaN(parseInt(e.target.value, 10)) ? setCapabilityParam(index, 'value', parseInt(e.target.value, 10)) : setCapabilityParam(index, 'value', undefined)}/>; 
      case 'json_object': return <Input type='textarea' rows={4} placeholder='Value' value={cap.value} 
        onChange={(e) => setCapabilityParam(index, 'value', e.target.value)}/>;
      case 'file': return <div>
        <Input placeholder='Value' value={cap.value} addonAfter={buttonAfter}/>
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
    typeof('');
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
    const {setCapabilityParam, caps, addCapability, removeCapability, saveSession, hideSaveAsModal, saveAsText, showSaveAsModal, setSaveAsText} = this.props;

    return <div>
      <h4>Desired Capabilities</h4> 
      <Row> 
      <Col span={12}>
        <Form inline>
          {caps.map((cap, index) => {
            return <div key={index} className={SessionStyles['desired-capabilities-form-container']}>
              <FormItem>
                <Input placeholder='Name' value={cap.name} onChange={(e) => setCapabilityParam(index, 'name', e.target.value)}/>
              </FormItem>
              <FormItem>
                <select onChange={(e) => this.handleSetType(index, e.target.value)} value={cap.type}>
                  <option value='text'>text</option>
                  <option value='boolean'>boolean</option>
                  <option value='number'>number</option>
                  <option value='json_object'>JSON object</option>
                  <option value='file'>filepath</option>
                </select>
              </FormItem>
              <FormItem>
                {this.getCapsControl(cap, index)}
              </FormItem>
              <FormItem>
                { (caps.length > 1) && <Button icon='delete' onClick={() => removeCapability(index)}/> }
                <Button icon='plus' onClick={addCapability} className={SessionStyles['add-desired-capability-button']} />
              </FormItem>
            </div>;
          })}
        </Form>
      </Col>

      <Col span={12}>        
        <FormattedCaps {...this.props} />
        <Modal visible={showSaveAsModal}
          title='Save Session As'
          okText='Save'
          cancelText='Cancel' 
          onCancel={hideSaveAsModal} 
          onOk={() => saveSession(caps, {name: saveAsText})}>
          <Input onChange={(e) => setSaveAsText(e.target.value)} placeholder='Name' value={saveAsText}/>
        </Modal>
      </Col>
      </Row>
    </div>;
  }
}