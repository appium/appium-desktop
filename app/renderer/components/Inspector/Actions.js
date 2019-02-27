import React, { Component } from 'react';
import _ from 'lodash';
import { Col, Button, Select, Modal } from 'antd';
import { actionDefinitions } from './shared';

const Option = { Select };

export default class Action extends Component {

  performAction (action) {
    const { startEnteringActionArgs } = this.props;
    startEnteringActionArgs(action);
  }

  render () {
    const {
      t, selectActionGroup, selectSubActionGroup, selectedActionGroup, selectedSubActionGroup, pendingAction,
      cancelPendingAction } = this.props;
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
      selectedSubActionGroup && _.toPairs(actionDefinitions[selectedActionGroup][selectedSubActionGroup]).map(([actionName, action]) => <Col span={8}>
        <Button style={{width: '100%'}} onClick={() => this.performAction(action) }>{actionName}</Button>
      </Col>),
      !!pendingAction && <Modal
        title="Basic Modal"
        visible={!!pendingAction}
        okText={t('Execute Action')}
        onOk={() => alert("Executin'")}
        onCancel={() => cancelPendingAction()}>{pendingAction.methodName}</Modal>
    ];
  }
}
