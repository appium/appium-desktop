import React, { Component } from 'react';
import { Icon, Modal, Table, Button } from 'antd';
import { toPairs } from 'lodash';
import PlaybackStyles from './PlaybackLibrary.css';

import { ACTION_STATE_PENDING, ACTION_STATE_IN_PROGRESS, ACTION_STATE_COMPLETE,
  ACTION_STATE_ERRORED, ACTION_STATE_CANCELED } from '../../actions/PlaybackLibrary';

function iconForState (state) {
  const iconMap = {
    [ACTION_STATE_PENDING]: 'ellipsis',
    [ACTION_STATE_IN_PROGRESS]: 'loading',
    [ACTION_STATE_COMPLETE]: 'check-circle-o',
    [ACTION_STATE_ERRORED]: 'exclamation-circle-o',
    [ACTION_STATE_CANCELED]: 'close',
  };
  const icon = iconMap[state];
  const colorMap = {
    [ACTION_STATE_PENDING]: '#ccc',
    [ACTION_STATE_IN_PROGRESS]: '#666',
    [ACTION_STATE_COMPLETE]: 'green',
    [ACTION_STATE_ERRORED]: '#ca6666',
    [ACTION_STATE_CANCELED]: '#888668',
  };
  const color = colorMap[state];
  if (!icon) {
    throw new Error(`No icon for state ${state}`);
  }
  return {icon, color};
}

export default class TestRun extends Component {

  getTestStatus () {
    const {actionsStatus} = this.props;
    const allStates = actionsStatus.map((action) => action.state);

    if (allStates.indexOf(ACTION_STATE_ERRORED) !== -1) {
      return {
        ...iconForState(ACTION_STATE_ERRORED),
        text: 'Failed',
        className: 'failed',
      };
    }

    if (allStates.indexOf(ACTION_STATE_CANCELED) !== -1) {
      return {
        ...iconForState(ACTION_STATE_CANCELED),
        text: 'Canceled',
        className: 'canceled'
      };
    }

    if (allStates.indexOf(ACTION_STATE_PENDING) !== -1 ||
        allStates.indexOf(ACTION_STATE_IN_PROGRESS) !== -1) {
      return {
        ...iconForState(ACTION_STATE_IN_PROGRESS),
        text: 'In Progress',
        className: 'inProgress'
      };
    }

    return {
      ...iconForState(ACTION_STATE_COMPLETE),
      text: 'Passed',
      className: 'passed'
    };
  }

  render () {
    const {actionsStatus, isTestRunning, hideTestRunModal, testToRun,
      testResultToShow, savedTests
    } = this.props;

    let testName = null;
    const visible = !!(testToRun || testResultToShow);

    if (visible) {
      testName = savedTests
        .filter((t) => (t.name === testToRun || t.name === testResultToShow))[0]
        .name;
    }

    const columns = [{
      title: 'Status',
      dataIndex: 'state',
      key: 'state',
      width: 60,
      render: (state) => {
        const {icon, color} = iconForState(state);
        return <Icon
          type={icon}
          style={{color}}
          className={PlaybackStyles.statusIcon}
        />;
      }
    }, {
      title: 'Step',
      dataIndex: 'key',
      key: 'key',
      width: 60,
      render: (text) => <div className={PlaybackStyles.stepNum}>
        {parseInt(text, 10) + 1}
      </div>
    }, {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => {
        if (record.action.indexOf('findElement') === 0) {
          return <div>
            <div><pre>{record.action}</pre></div>
            <div className={PlaybackStyles.findElInfo}>
              <div>Strategy: <code>{record.params[0]}</code></div>
              <div>Selector: <code>"{record.params[1]}"</code></div>
            </div>
          </div>;
        }

        return <pre>{text}</pre>;
      }
    }];

    let data = [];
    for (let [index, action] of toPairs(actionsStatus)) {
      data.push({
        action: action.action,
        state: action.state,
        params: action.params,
        key: index
      });
    }

    const testStatus = this.getTestStatus();

    return <Modal
      className={PlaybackStyles.testRunModal}
      visible={visible}
      closable={false}
      footer={
        <Button onClick={hideTestRunModal} disabled={isTestRunning}>Done</Button>
      }
      title={testName}
    >
      <div className={`${PlaybackStyles.testStatus} ${PlaybackStyles[testStatus.className]}`}>
        <span style={{color: testStatus.color}}><Icon type={testStatus.icon} /> Status: <b>{testStatus.text}</b></span>
      </div>
      <Table
        columns={columns}
        showHeader={false}
        bordered={false}
        dataSource={data}
        pagination={false}
      />
    </Modal>;
  }
}
