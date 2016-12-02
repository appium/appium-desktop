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

  handleSubmit (e) {
    e.preventDefault();
    this.props.onCreateNewSession();
  }

  showSaveAsModal () {
    let state = this.state;
    state = {...state};
    state.showSaveAsModal = true;
    this.setState(state);
  }

  hideSaveAsModal () {
    let state = this.state;
    state = {...state};
    state.showSaveAsModal = false;
    this.setState(state);
  }

  saveSession () {
    const { props, saveSession, caps } = this.props;
    saveSession(this.state.saveAsText, caps);
    this.hideSaveAsModal();
  }

  setSaveAsText (saveAsText) {
    let state = this.state;
    state = {...state};
    state.saveAsText = saveAsText;
    this.setState(state);
  }

  render () {
    const { newSession, setCapabilityParam, caps, addCapability, removeCapability, saveSession } = this.props;

    return <div>
      <Row>
      <Col span={12}>
        <form onSubmit={(e) => {e.preventDefault(); newSession(desiredCapabilities); }}>
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
                <Button icon='minus' onClick={() => removeCapability(index)}/>
              </Col>
            </Row>;
          })}
          <Row>
            <Col span={24}>
              <Button type="submit" onClick={() => newSession(caps)}>Start Session</Button>
              <Button type="button" onClick={this.showSaveAsModal.bind(this)}>Save As</Button>
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
      <Modal visible={this.state.showSaveAsModal}
        title='Save Session As'
        okText='Save'
        cancelText='Cancel' 
        onCancel={this.hideSaveAsModal.bind(this)} 
        onOk={this.saveSession.bind(this)}>
        <Input onChange={(e) => this.setSaveAsText(e.target.value)} placeholder='Name' value={this.state.saveAsText}/>
      </Modal>
    </div>;
  }
}