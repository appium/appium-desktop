import React, { Component } from 'react';
import { Row, Col, Button, Switch, Input, InputNumber, Dropdown, Menu, Icon } from 'antd';
import prettyJSON from 'prettyjson';

export default class NewSessionForm extends Component {

  constructor (props) {
    super(props);
  }

  static defaultProps = {
    desiredCapabilities: {},
    onCreateNewSession: () => {},
    onChangeCapability: () => {},
  };

  handleSubmit (e) {
    e.preventDefault();
    this.props.onCreateNewSession();
  }

  render () {
    const { newSession, desiredCapabilities, setCapabilityParam, caps, addCapability, removeCapability } = this.props;

    return desiredCapabilities && (
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
              <Button type="submit" onClick={() => newSession(desiredCapabilities)}>Start Session</Button>
            </Col>
          </Row>
        </form>
      </Col>
      <Col span={12}>
        <pre>
          {prettyJSON.render(desiredCapabilities)}
        </pre>
      </Col>
      </Row>
    );
  }
}