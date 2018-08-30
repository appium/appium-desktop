import React, { Component } from 'react';
import { Select, Col, Row, Button, Alert } from 'antd';
import _ from 'lodash';
import changeCase from 'change-case';
import mobileCommands from './MobileCommandList';
import CommandArgs from './CommandArgs';

const {Option} = Select;

export default class MobileCommands extends Component {

  isHiddenCommand (commandValue, automationName) {
    if (_.isString(automationName)) {
      automationName = automationName.toLowerCase();
    }
    let automations = commandValue.automation;
    if (!_.isArray(automations)) {
      automations = [automations];
    }

    // Hide the command if there's and automation and it's not on the whitelist (allow 'fake' for testing/dev purposes)
    return automationName && automationName !== 'fake' && !automations.includes(automationName);
  }

  render () {
    const {commandGroup, setCommandGroup, setCommand, command, executeCommand, commandCallError, commandCallResult, sessionDetails} = this.props;
    const {desiredCapabilities} = sessionDetails;
    const automationName = desiredCapabilities ? desiredCapabilities.automationName || desiredCapabilities.deviceName : null;
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
              !this.isHiddenCommand(commandValue, automationName) && <Option key={commandName} value={commandName}>{commandValue.displayName || changeCase.titleCase(commandName)}</Option>
            ))}
          </Select>
        </Col>
      </Row>
      {command && <div>
        <CommandArgs {...this.props} />
        <Row gutter={16}>
          <Col span={24}>
              <Button type='primary' style={{width: '100%'}} onClick={() => executeCommand()}>Execute</Button>
          </Col>
        </Row>
      </div>}
      <Row gutter={16}>
        <Col span={24}>
        {commandCallResult && <Alert
          message="Completed action"
          description={commandCallError}
          type="success"
        />}
        {commandCallError && <Alert
          message="Could not complete command"
          description={commandCallError}
          type="error"
        />}
        </Col>
      </Row>
    </div>;
  }
}
