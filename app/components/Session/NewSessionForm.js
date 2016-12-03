import React, { Component } from 'react';
import { Row, Col, Button, Switch, Input, InputNumber, Dropdown, Menu, Icon, Modal } from 'antd';
import prettyJSON from 'prettyjson';

export default class NewSessionForm extends Component {

  constructor (props) {
    super(props);

    this.state = {
      showSaveAsModal: false,
    };
  }

  static defaultProps = {
    desiredCapabilities: {},
    onCreateNewSession: () => {},
    onChangeCapability: () => {},
  };

  getCapsObject () {
    const { caps } = this.props;
    let capsObject = {};
    caps.forEach((cap) => capsObject[cap.name] = cap.value);
    return capsObject;
  }

  render () {
    const { newSession, setCapabilityParam, caps, addCapability, removeCapability, saveSession,
      requestSaveAsModal, hideSaveAsModal, saveAsText, showSaveAsModal, setSaveAsText } = this.props;

    return <div>
      <Row>
      <Col span={12}>
        <form onSubmit={(e) => {e.preventDefault(); newSession(caps); }}>
          {caps.map((cap, index) => {
            return <Row key={index}>
              <Col span={6}>
                <Input placeholder='Name' value={cap.name} onChange={(e) => setCapabilityParam(index, 'name', e.target.value)}/>
              </Col>
              <Col span={6}>
                <select onChange={(e) => setCapabilityParam(index, 'type', e.target.value)}>
                  <option name='text'>text</option>
                  <option name='boolean'>boolean</option>
                  <option name='number'>number</option>
                  <option name='json_object'>JSON object</option>
                  <option name='file'>file</option>
                </select>
              </Col>
              <Col span={6}>
                <Input placeholder='Value' value={cap.value} onChange={(e) => setCapabilityParam(index, 'value', e.target.value)}/>
              </Col>
              <Col span={6}>
                <Button icon='plus' onClick={addCapability}/>
                <Button icon='cancel' onClick={() => removeCapability(index)}/>
              </Col>
            </Row>;
          })}
          <Row>
            <Col span={24}>
              <Button type="submit" onClick={() => newSession(caps)}>Start Session</Button>
              <Button type="button" onClick={requestSaveAsModal}>Save As</Button>
            </Col>
          </Row>
        </form>
      </Col>
      <Col span={12}>
        <pre>
          {prettyJSON.render(this.getCapsObject(caps))}
        </pre>
      </Col>
      </Row>
      <Modal visible={showSaveAsModal}
        title='Save Session As'
        okText='Save'
        cancelText='Cancel' 
        onCancel={hideSaveAsModal} 
        onOk={() => saveSession(saveAsText, caps)}>
        <Input onChange={(e) => setSaveAsText(e.target.value)} placeholder='Name' value={saveAsText}/>
      </Modal>
    </div>;
  }
}