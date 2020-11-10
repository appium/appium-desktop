import React, { Component } from 'react';
import _ from 'lodash';
import { Row, Col, Button, Select, Modal, Input, notification, } from 'antd';
import { actionDefinitions, actionArgTypes } from './shared';
import InspectorStyles from './Inspector.css';
import { INPUT } from '../../../../../shared/components/AntdTypes';

export default class Actions extends Component {

  startPerformingAction (actionName, action) {
    const { startEnteringActionArgs, applyClientMethod } = this.props;
    if (_.isEmpty(action.args)) {
      applyClientMethod({methodName: action.methodName, args: [], skipRefresh: !action.refresh, ignoreResult: false});
    } else {
      startEnteringActionArgs(actionName, action);
    }
  }

  executeCommand () {
    const { pendingAction, cancelPendingAction, applyClientMethod, t } = this.props;
    let {args, action} = pendingAction;
    let {methodName} = action;

    // Special case for 'startActivity'
    // TODO: Fix these... args aren't getting through
    if (action.methodName === 'startActivity') {
      args = {appPackage: args[0], appActivity: args[1], appWaitPackage: args[2],
              intentAction: args[3], intentCategory: args[4], intentFlags: args[5],
              optionalIntentArguments: args[6], dontStopAppOnReset: args[7]};
    }

    // Special case for 'rotateDevice'
    if (action.methodName === 'rotateDevice') {
      args = {x: args[0], y: args[1], duration: args[2], radius: args[3], rotation: args[4], touchCount: args[5]};
    }

    // Special case for 'execute'
    if (action.methodName === 'executeScript') {
      if (!_.isEmpty(args[1])) {
        try {
          args[1] = JSON.parse(args[1]);
        } catch (e) {
          notification.error({
            message: t('invalidJson', {json: args[1]}),
            duration: 5,
          });
        }
      }
    }

    // Special case for 'updateSettings'
    if (action.methodName === 'updateSettings') {
      if (_.isString(args[0])) {
        try {
          args[0] = JSON.parse(args[0]);
        } catch (e) {
          notification.error({
            message: t('invalidJson', {json: args[0]}),
            duration: 5,
          });
        }
      }
    }

    applyClientMethod({methodName, args, skipRefresh: !action.refresh, ignoreResult: false});
    cancelPendingAction();
  }

  render () {
    const {
      t, selectActionGroup, selectSubActionGroup, selectedActionGroup, selectedSubActionGroup, pendingAction,
      cancelPendingAction, setActionArg } = this.props;
    return <div className={InspectorStyles['actions-container']}>
      <Row gutter={16} className={InspectorStyles['arg-row']}>
        <Col span={24}>
          <Select onChange={(actionGroupName) => selectActionGroup(actionGroupName)} placeholder={t('Select Action Group')}>
            { _.keys(actionDefinitions).map((actionGroup) => <Select.Option key={actionGroup}>{t(actionGroup)}</Select.Option>) }
          </Select>
        </Col>
      </Row>
      {selectedActionGroup && <Row>
        <Col span={24}>
          <Select onChange={(actionGroupName) => selectSubActionGroup(actionGroupName)} placeholder={t('Select Sub Group')}>
            { _.keys(actionDefinitions[selectedActionGroup]).map((actionGroup) => <Select.Option key={actionGroup}>{t(actionGroup)}</Select.Option>) }
          </Select>
        </Col>
      </Row>}
      <Row>
        {selectedSubActionGroup && _.toPairs(actionDefinitions[selectedActionGroup][selectedSubActionGroup]).map(([actionName, action], index) => <Col key={index} span={8}>
          <div className={InspectorStyles['btn-container']}>
            <Button onClick={() => this.startPerformingAction(actionName, action)}>{t(actionName)}</Button>
          </div>
        </Col>)}
      </Row>
      {!!pendingAction && <Modal
        title={pendingAction.actionName}
        okText={t('Execute Action')}
        visible={!!pendingAction}
        onOk={() => this.executeCommand()}
        onCancel={() => cancelPendingAction()}>
        {
          !_.isEmpty(pendingAction.action.args) && _.map(pendingAction.action.args, ([argName, argType], index) => <Row key={index} gutter={16}>
            <Col span={24} className={InspectorStyles['arg-container']}>
              {
                argType === actionArgTypes.NUMBER && <Input
                  type={INPUT.NUMBER}
                  value={pendingAction.args[index]}
                  addonBefore={t(argName)}
                  onChange={(e) => setActionArg(index, _.toNumber(e.target.value))}
                />
              }
              {argType === actionArgTypes.STRING && <Input addonBefore={t(argName)} onChange={(e) => setActionArg(index, e.target.value)}/>}
            </Col>
          </Row>)
        }
      </Modal>}
    </div>;
  }
}
