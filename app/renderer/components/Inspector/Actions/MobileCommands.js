import React, { Component } from 'react';
import { Select, Col, Row } from 'antd';
import _ from 'lodash';
import changeCase from 'change-case';
import mobileCommands from './MobileCommandList';

const {Option} = Select;

export default class MobileCommands extends Component {

  render () {
    const {commandGroup, setCommandGroup, setCommand, command} = this.props;
    const groupPairs = _.toPairs(mobileCommands.groups);
    const commandsPairs = _.toPairs(mobileCommands.groups[commandGroup].commands);

    return <div>
      <Row gutter={16}>
        <Col span={24}>
          <Select style={{width: '100%'}} value={commandGroup} onChange={(value) => setCommandGroup(value)}>
            {_.map(groupPairs, ([groupName, groupValue]) => (
              <Option key={groupName} value={groupName}>{groupValue.displayName || changeCase.titleCase(groupName)}</Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Select style={{width: '100%'}} value={command} onChange={(value) => setCommand(value)}>
            {_.map(commandsPairs, ([commandName, commandValue]) => (
              !commandValue.skipUi && <Option key={commandName} value={commandName}>{commandValue.displayName || changeCase.titleCase(commandName)}</Option>
            ))}
          </Select>
        </Col>
      </Row>
    </div>;
  }
}
