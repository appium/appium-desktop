import React, { Component } from 'react';
import { Select, Col, Row, Button, Alert } from 'antd';
import _ from 'lodash';
import changeCase from 'change-case';
import mobileCommands from './MobileCommandList';

const {Option} = Select;

export default class CommandArgs extends Component {

  stringRender (label) {

  }

  render () {
    const {commandGroup, command} = this.props;

    if (!command) {
      return null;
    }

    return <div>
      
    </div>;
  }
}
