import React, { Component } from 'react';
import _ from 'lodash';
import { Row, Col, Button, Select } from 'antd';
import { actionDefinitions } from './shared';

const Option = { Select };

export default class Action extends Component {

  performAction (/*actionDefinition, e*/) {
    const { applyClientMethod } = this.props;
    applyClientMethod({methodName: 'backgroundApp', args: [10]});
  }

  render () {
    const { t, selectActionGroup, selectSubActionGroup, selectedActionGroup, selectedSubActionGroup } = this.props;

    return [
      <Col span={24}>
        <Select style={{width: '100%'}} onChange={(actionGroupName) => selectActionGroup(actionGroupName)} placeholder="Select Action Group">
          { _.keys(actionDefinitions).map((actionGroup) => <Option key={actionGroup}>{t(actionGroup)}</Option>) }
        </Select>
      </Col>,
      selectedActionGroup && <Col span={24}>
        <Select style={{width: '100%'}} onChange={(actionGroupName) => selectSubActionGroup(actionGroupName)} placeholder="Select Sub Group">
          { _.keys(actionDefinitions[selectedActionGroup]).map((actionGroup) => <Option key={actionGroup}>{t(actionGroup)}</Option>) }
        </Select>
      </Col>,
      <Col span={8}>
        <Button style={{width: '100%'}} onClick={() => this.performAction() }>{t('Background App')}</Button>
      </Col>
    ];
  }
}
