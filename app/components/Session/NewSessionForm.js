import React, { Component } from 'react';
import { Button, Switch, Input, Modal, Form, Icon, Row, Col } from 'antd';
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
  }

  getCapsControl (cap, index) {
    const {setCapabilityParam} = this.props;

    const buttonAfter = <Icon className={SessionStyles['filepath-button']}
      type="file" 
      onClick={() => this.getLocalFilePath((filepath) => setCapabilityParam(index, 'value', filepath))} />;

    switch (cap.type) {
      case 'text': return <Input placeholder='Value' value={cap.value} onChange={(e) => setCapabilityParam(index, 'value', e.target.value)}/>;
      case 'boolean': return <Switch checkedChildren={'true'} unCheckedChildren={'false'} 
        placeholder='Value' value={cap.value} onChange={(e) => setCapabilityParam(index, 'value', e.target.value)}/>;
      case 'number': return <Input placeholder='Value' value={cap.value} onChange={(e) => setCapabilityParam(index, 'value', e.target.value)}/>; 
      case 'json_object': return <Input type='textarea' rows={4} placeholder='Value' value={cap.value} 
        onChange={(e) => setCapabilityParam(index, 'value', e.target.value)}/>;
      case 'file': return <div>
        <Input placeholder='Value' value={cap.value} addonAfter={buttonAfter}/>
      </div>;
      default: 
        throw `Invalid cap type: ${cap.type}`;
    }
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
                <select onChange={(e) => setCapabilityParam(index, 'type', e.target.value)} value={cap.type}>
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