import React, { Component } from 'react';
import { Select, Col, Row, Button, Alert, Input, Checkbox } from 'antd';
import _ from 'lodash';
import changeCase from 'change-case';
import mobileCommands from './MobileCommandList';

const {Option} = Select;

export default class CommandArgs extends Component {

  setValue (key, value) {
    this.props.setCommandArg(key, value);
  }

  stringRender (key) {
    return <Input key={key} addonBefore={key} onChange={(evt) => this.setValue(key, evt.target.value)} />;
  }

  numberRender (key) {
    return null;
  }

  elementRender (key) {
    return null;
  }

  booleanRender (key) {
    return <Checkbox key={key} onChange={(evt) => this.setValue(key, evt.target.checked)}>{key}</Checkbox>;
  }

  enumRender (key, opts) {
    return <Select key={key} style={{width: '100%'}} placeholder={key} onChange={(value) => this.setValue(key, value)}>
      {_.map(opts, (opt) => (
        <Option key={opt} value={opt}>{opt}</Option>
      ))}
    </Select>;
  }

  primitiveRender (type, key) {
    if (_.isArray(type)) {
      const opts = type;
      return this.enumRender(key, opts);
    }
    switch (type) {
      case 'string': return this.stringRender(key);
      case 'number': return this.numberRender(key);
      case 'boolean': return this.booleanRender(key);
      case 'element': return this.elementRender(key);
      default: return null;
    }
  }

  argRender (arg) {
    if (_.isObject(arg)) {
      const argPairs = _.toPairs(arg);
      return _.map(argPairs, ([key, type]) => (
        this.primitiveRender(type, key)
      ));
    } else {
      return null;
    }
  }

  render () {
    const {commandGroup, command} = this.props;

    if (!commandGroup || !command) {
      return null;
    }

    let args = mobileCommands.groups[commandGroup].commands[command].args;
    return <div>{this.argRender(args)}</div>;
  }
}
