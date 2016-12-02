import React, { Component } from 'react';
let { desiredCapabilityConstraints } = require('appium-base-driver/build/lib/basedriver/desired-caps');
import { Row, Col, Button, Switch } from 'antd';
import prettyJSON from 'prettyjson';

desiredCapabilityConstraints = {
  app: {
    isFile: true,
    presence: true,
  },
  ...desiredCapabilityConstraints,
};

function unCamelCase (str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
    .replace(/^./, function (str) { return str.toUpperCase(); });
}

export default class NewSessionForm extends Component {

  static defaultProps = {
    desiredCapabilities: {},
    onCreateNewSession: () => {},
    onChangeCapability: () => {},
  };

  componentWillMount () {
    this.props.getDefaultCaps(desiredCapabilityConstraints);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.onCreateNewSession();
  }

  render () {
    const { newSession, desiredCapabilities, changeCapability, saveSession } = this.props;

    return desiredCapabilities && (
      <Row>
      <Col span={12}>
        <form onSubmit={(e) => {e.preventDefault(); newSession(desiredCapabilities); }}>
          {Object.keys(desiredCapabilityConstraints).map((key) => {
            let capConstraint = desiredCapabilityConstraints[key];
            let options = capConstraint.inclusionCaseInsensitive || capConstraint.inclusion;
            let form;

            if (options) {
              form = <select value={desiredCapabilities[key]} onChange={(e) => changeCapability(key, e.target.value)} name={key}>
                  { options.map((name) => <option key={name} name={name}>{name}</option>) }
              </select>;
            } else if (capConstraint.isBoolean) {
              form = <Switch checked={desiredCapabilities[key]} onChange={(checked) => changeCapability(key, checked)} />;
            } else if (capConstraint.isFile) {
              form = form = <input type='text' value={desiredCapabilities[key]} onChange={(e) => changeCapability(key, e.target.value)}/>; 
            } else {
              let type = capConstraint.isNumber ? 'number' : 'text';
              form = <input type={type} value={desiredCapabilities[key]} onChange={(e) => changeCapability(key, e.target.value)}/>;
            }

            return <Row key={key}>
              <Col span={12}>
                  <label htmlFor={key}>{unCamelCase(key)}</label>
              </Col>
              <Col span={12}>{form}</Col>
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