import React, { Component } from 'react';
import { Row, Col, Button, Switch, Input, InputNumber, Dropdown, Menu, Icon, Modal, Form } from 'antd';
import prettyJSON from 'prettyjson';

const FormItem = Form.Item;

export default class NewSessionForm extends Component {

  getCapsObject () {
    const { caps } = this.props;
    let capsObject = {};
    caps.forEach((cap) => capsObject[cap.name] = cap.value);
    return capsObject;
  }

  render () {
    const { newSession, setCapabilityParam, caps, addCapability, removeCapability, saveSession,
      requestSaveAsModal, hideSaveAsModal, saveAsText, showSaveAsModal, setSaveAsText } = this.props;

    return <Form inline onSubmit={(e) => {e.preventDefault(); newSession(caps); }}>
        {caps.map((cap, index) => {
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
                <option value='file'>file</option>
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
                    case 'file': return <Input type='file' placeholder='Value' value={cap.value} onChange={(e) => setCapabilityParam(index, 'value', e.target.value)}/>;
                    default: break;
                  }
                }()
              }
            </FormItem>
            <FormItem>
              <Button icon='plus' onClick={addCapability} style={{marginRight: '1em'}}/>
              { caps.length > 1 && <Button icon='delete' onClick={() => removeCapability(index)}/> }
            </FormItem>
          </div>;
        })}

        <Button type="submit" onClick={() => newSession(caps)} style={{marginRight: '1em'}}>Start Session</Button>
        <Button type="button" onClick={requestSaveAsModal}>Save As</Button>
        
        <pre>
          {prettyJSON.render(this.getCapsObject(caps))}
        </pre>
      <Modal visible={showSaveAsModal}
        title='Save Session As'
        okText='Save'
        cancelText='Cancel' 
        onCancel={hideSaveAsModal} 
        onOk={() => saveSession(saveAsText, caps)}>
        <Input onChange={(e) => setSaveAsText(e.target.value)} placeholder='Name' value={saveAsText}/>
      </Modal>
    </Form>;
  }
}