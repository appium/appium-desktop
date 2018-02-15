import React, { Component } from 'react';
import { Icon, Modal, Table, Button } from 'antd';
import { toPairs, sum } from 'lodash';
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

  getTestTime () {
    return sum(this.props.actionsStatus.map((action) => action.elapsedMs || 0));
  }

  getTableData () {
    const {actionsStatus} = this.props;

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
        let actionStep = <pre>{text}</pre>;
        if (record.action.indexOf('findElement') === 0) {
          actionStep = <div>
            <div><pre>{record.action}</pre></div>
            <div className={PlaybackStyles.findElInfo}>
              <div>Strategy: <code>{record.params[0]}</code></div>
              <div>Selector: <code>"{record.params[1]}"</code></div>
            </div>
          </div>;
        }

        if (!record.err) {
          return actionStep;
        }

        let errText = record.err.message;

        return <div>
          {actionStep}
          <div className={PlaybackStyles.actionErr}>{errText}</div>
        </div>;
      }

    }, {
      title: 'Time',
      dataIndex: 'elapsedMs',
      key: 'elapsedMs',
      width: 60,
      render: (text, record) => {
        let timeText = "";
        if (record.elapsedMs) {
          timeText = `${record.elapsedMs / 1000}s`;
        }
        return <div className={PlaybackStyles.elapsedTime}>
          {timeText}
        </div>;
      }
    }];

    let data = [];
    for (let [index, action] of toPairs(actionsStatus)) {
      data.push({
        ...action,
        key: index
      });
    }

    return {data, columns};
  }

  getTestNameToShow () {
    const {testToRun, testResultToShow} = this.props;
    return testToRun || testResultToShow;
  }

  isModalVisible () {
    return !!(this.getTestNameToShow());
  }

  getTestToShow () {
    const {testToRun, savedTests, testResults} = this.props;
    return (testToRun ? savedTests : testResults)
      .filter((t) => t.name === this.getTestNameToShow())[0];
  }

  getTestHeader () {
    const {serverType} = this.props;
    const test = this.getTestToShow();
    let testTime = this.getTestTime();
    testTime = testTime ? `(${testTime / 1000}s)` : '';

    const testStatus = this.getTestStatus();

    return <div>
      <div className={`${PlaybackStyles.testStatus} ${PlaybackStyles[testStatus.className]}`}>
        <span style={{color: testStatus.color}}><Icon type={testStatus.icon} />&nbsp;<b>{testStatus.text}</b> {testTime}</span>
      </div>

      {test &&
        <div className={PlaybackStyles.testMetadata}>
          <div><b>App:</b> <code>{test.caps.app || test.caps.browserName}</code></div>
          <div><b>Platform:</b> <code>{test.caps.platformName}</code></div>
          <div><b>Server:</b> <code>{test.serverType || serverType}</code></div>
        </div>
      }
    </div>;
  }

  render () {
    const {isTestRunning, hideTestRunModal} = this.props;

    let testName = null;
    const visible = this.isModalVisible();
    const test = this.getTestToShow();

    if (visible) {
      testName = test.name;
    }

    const {columns, data} = this.getTableData();

    return <Modal
      className={PlaybackStyles.testRunModal}
      visible={visible}
      closable={false}
      footer={
        <Button onClick={hideTestRunModal} disabled={isTestRunning}>Done</Button>
      }
      title={testName}
    >

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
