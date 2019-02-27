import React, { Component } from 'react';
import _ from 'lodash';
import { Row, Col, Button, Select, Modal, Input } from 'antd';
import { actionDefinitions, actionArgTypes } from './shared';

const { JSON, STRING, NUMBER, BOOLEAN, ARRAY } = actionArgTypes;

const Option = { Select };

export default class Actions extends Component {

  startPerformingAction (actionName, action) {
    const { startEnteringActionArgs } = this.props;
    startEnteringActionArgs(actionName, action);
  }

  executeCommand () {
    const { pendingAction, cancelPendingAction, applyClientMethod } = this.props;
    const {args, action} = pendingAction;
    applyClientMethod({methodName: action.methodName, args});
    cancelPendingAction();
  }

  render () {
    const {
      t, selectActionGroup, selectSubActionGroup, selectedActionGroup, selectedSubActionGroup, pendingAction,
      cancelPendingAction, setActionArg } = this.props;
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
        <Button style={{width: '100%'}} onClick={() => this.startPerformingAction(actionName, action) }>{actionName}</Button>
      </Col>),
      !!pendingAction && <Modal
        title={pendingAction.actionName}
        visible={!!pendingAction}
        okText={t('Execute Action')}
        onOk={() => this.executeCommand()}
        onCancel={() => cancelPendingAction()}>
        {
          _.map(pendingAction.action.args, ([argName, argType], index) => <Row key={index}>
            <Col span={24}>
              {argType === NUMBER && <Input type="number" addonBefore={t(argName)} onChange={(e) => setActionArg(index, _.toNumber(e.target.value))}/>}
              {argType === BOOLEAN && <Input addonBefore={t(argName)}/>}
              {argType === STRING && <Input addonBefore={t(argName)}/>}
              {argType === JSON && <Input addonBefore={t(argName)}/>}
              {argType === ARRAY && <Input addonBefore={t(argName)}/>}
            </Col>
          </Row>)
        }
      </Modal>
    ];
  }
}
