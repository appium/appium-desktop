import React, { Component } from 'react';
import { Row, Col, Button, Switch, Input, InputNumber, Dropdown, Menu } from 'antd';
import prettyJSON from 'prettyjson';

function unCamelCase (str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
    .replace(/^./, function (str) { return str.toUpperCase(); });
}

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
    const { newSession, desiredCapabilities, changeCapability } = this.props;

    let typeMenu = <Menu>
                    <Menu.Item key="1">1st menu item</Menu.Item>
                    <Menu.Item key="2">2nd menu item</Menu.Item>
                    <Menu.Item key="3">3d menu item</Menu.Item>
                  </Menu>;

    return desiredCapabilities && (
      <Row>
      <Col span={12}>
        <form onSubmit={(e) => {e.preventDefault(); newSession(desiredCapabilities); }}>
          {
            <Row>
              <Col span={8}>
                <Input placeholder='Name'/>
              </Col>
              <Col span={8}>
                <Dropdown.Button overlay={typeMenu}>Data Type</Dropdown.Button>
              </Col>
              <Col span={8}>
                <Input placeholder='Value' />
              </Col>
            </Row>
          }
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