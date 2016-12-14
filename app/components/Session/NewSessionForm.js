import React, { Component } from 'react';
import { Button, Switch, Input, Modal, Form, Icon, Row, Col } from 'antd';
import { remote } from 'electron';
import FormattedCaps from './FormattedCaps';

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

  getCapsObject () {
    const {caps} = this.props;
    let capsObject = {};
    caps.forEach((cap) => capsObject[cap.name] = cap.value);
    return capsObject;
  }

  render () {
    const {setCapabilityParam, caps, addCapability, removeCapability, saveSession, hideSaveAsModal, saveAsText, showSaveAsModal, setSaveAsText} = this.props;

    return <div>
      <h4>Desired Capabilities</h4> 
      <Row> 
      <Col span={12}>
        <Form inline>
          {caps.map((cap, index) => {
            const buttonAfter = <Icon style={{cursor: 'pointer'}} type="file" onClick={() => this.getLocalFilePath((filepath) => setCapabilityParam(index, 'value', filepath))} />;
            return <div key={index} style={{marginBottom: '1em'}}>
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
                {
                  function () {
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
                      default: break;
                    }
                  }.bind(this)()
                }
              </FormItem>
              <FormItem>
                { (caps.length > 1) && <Button icon='delete' onClick={() => removeCapability(index)}/> }
                { (index === caps.length - 1) && <Button icon='plus' onClick={addCapability} style={{marginLeft: '4px'}}/> }
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