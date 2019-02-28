import React, { Component } from 'react';
import _ from 'lodash';
import { Row, Col, Button, Select, Modal, Input } from 'antd';
import { actionDefinitions, actionArgTypes } from './shared';

const { JSON, STRING, NUMBER, BOOLEAN, ARRAY } = actionArgTypes;

const Option = { Select };

export default class Actions extends Component {

  startPerformingAction (actionName, action) {
    const { startEnteringActionArgs, applyClientMethod } = this.props;
    if (_.isEmpty(action.args)) {
      applyClientMethod({methodName: action.methodName, args: [], skipScreenshotAndSource: !action.refresh});
    } else {
      startEnteringActionArgs(actionName, action);
    }
  }

  executeCommand () {
    const { pendingAction, cancelPendingAction, applyClientMethod } = this.props;
    const {args, action} = pendingAction;
    applyClientMethod({methodName: action.methodName, args, skipScreenshotAndSource: !action.refresh});
    cancelPendingAction();
  }

  render () {
    const {
      t, selectActionGroup, selectSubActionGroup, selectedActionGroup, selectedSubActionGroup, pendingAction,
      cancelPendingAction, setActionArg } = this.props;
    return [
      <Row gutter={16} style={{marginBottom: '8px'}}>
        <Col span={24}>
          <Select style={{width: '100%'}} onChange={(actionGroupName) => selectActionGroup(actionGroupName)} placeholder="Select Action Group">
            { _.keys(actionDefinitions).map((actionGroup) => <Option key={actionGroup}>{t(actionGroup)}</Option>) }
          </Select>
        </Col>
      </Row>,
      selectedActionGroup && <Row>
        <Col span={24}>
          <Select style={{width: '100%'}} onChange={(actionGroupName) => selectSubActionGroup(actionGroupName)} placeholder="Select Sub Group">
            { _.keys(actionDefinitions[selectedActionGroup]).map((actionGroup) => <Option key={actionGroup}>{t(actionGroup)}</Option>) }
          </Select>
        </Col>
      </Row>,
      selectedSubActionGroup && _.toPairs(actionDefinitions[selectedActionGroup][selectedSubActionGroup]).map(([actionName, action]) => <Col span={8}>
        <div style={{padding: '16px'}}>
          <Button style={{width: '100%'}} onClick={() => this.startPerformingAction(actionName, action) }>{actionName}</Button>
        </div>
      </Col>),
      !!pendingAction && <Modal
        title={pendingAction.actionName}
        okText={t('Execute Action')}
        visible={!!pendingAction}
        onOk={() => this.executeCommand()}
        onCancel={() => cancelPendingAction()}>
        {
          !_.isEmpty(pendingAction.action.args) && _.map(pendingAction.action.args, ([argName, argType], index) => <Row key={index} gutter={16}>
            <Col span={24} style={{padding: '8px 8px 0 0'}}>
              {argType === NUMBER && <Input type="number" value={pendingAction.args[index]} addonBefore={t(argName)} onChange={(e) => setActionArg(index, _.toNumber(e.target.value))} />}
              {argType === BOOLEAN && <Input addonBefore={t(argName)} />}
              {argType === STRING && <Input addonBefore={t(argName)} onChange={(e) => setActionArg(index, e.target.value)}/>}
              {argType === JSON && <Input addonBefore={t(argName)}/>}
              {argType === ARRAY && <Input addonBefore={t(argName)}/>}
            </Col>
          </Row>)
        }
      </Modal>
    ];
  }
}
