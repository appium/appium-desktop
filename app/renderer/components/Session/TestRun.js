import React, { Component } from 'react';
import { shell } from 'electron';
import moment from 'moment';
import { Icon, Modal, Table, Button } from 'antd';
import { toPairs, sum } from 'lodash';
import PlaybackStyles from './Playback.css';
import { iconForState, stateDataForTest, getTestResult, getTest,
  getSessionId, getTestUrl
} from './shared';
import { getCapsObject } from '../../actions/Session';

export default class TestRun extends Component {

  getTestStatus () {
    return stateDataForTest(this.getActionsToShow());
  }

  getTestTime () {
    return sum(this.props.actionsStatus.map((action) => action.elapsedMs || 0));
  }

  getTestNameToShow () {
    const {testInProgress, testResultToShow} = this.props;
    return testInProgress || testResultToShow;
  }

  isModalVisible () {
    return !!(this.getTestNameToShow());
  }

  getTestToShow () {
    const {testInProgress, savedTests, testResults, testResultToShow} = this.props;

    if (testInProgress) {
      return getTest(testInProgress, savedTests);
    }

    return getTestResult(testResultToShow, testResults);
  }

  getActionsToShow () {
    const {testInProgress, testResultToShow, testResults, actionsStatus} = this.props;
    if (testInProgress) {
      return actionsStatus;
    }

    if (testResultToShow) {
      return getTestResult(testResultToShow, testResults).actions;
    }

    return [];
  }

  getTestHeader () {
    const {serverType, testInProgress, caps} = this.props;
    const test = this.getTestToShow();
    let testTime = this.getTestTime();
    testTime = testTime ? `(${testTime / 1000}s)` : '';


    let capsHolder = test;
    if (testInProgress) {
      capsHolder = {caps: getCapsObject(caps)};
    }

    let serverTypeHolder = test;
    if (testInProgress) {
      serverTypeHolder = {serverType};
    }

    const testStatus = this.getTestStatus();

    return <div className={`${PlaybackStyles.testStatus} ${PlaybackStyles[testStatus.className]}`}>
      <span style={{color: testStatus.color}}><Icon type={testStatus.icon} />&nbsp;&nbsp;<b>{testStatus.text}</b> {testTime}</span>
      {test &&
        <div className={PlaybackStyles.testMetadata}>
          <div><b>App:</b> <code>{capsHolder.caps.app || capsHolder.caps.browserName || capsHolder.caps.appPackage || capsHolder.caps.bundleId}</code></div>
          <div><b>Platform:</b> <code>{capsHolder.caps.platformName}</code></div>
          <div><b>Server Type:</b> <code>{serverTypeHolder.serverType}</code></div>
          {test.date &&
            <div><b>Run at:</b> <code>{moment(test.date).format("YYYY-MM-DD HH:SS")}</code></div>
          }
        </div>
      }
    </div>;
  }

  getTableData () {

    const columns = [{
      title: 'Step',
      dataIndex: 'key',
      key: 'key',
      width: 60,
      render: (text) => <div className={PlaybackStyles.stepNum}>
        {parseInt(text, 10) + 1}
      </div>
    }, {
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
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => {
        let actionStep = <pre>
          {record.isElCmd && <span>&nbsp;&nbsp;<Icon type="arrow-right" />&nbsp;</span>}
          {text}
        </pre>;

        if (record.action.indexOf('findElement') === 0) {
          actionStep = <div>
            <div><pre>{record.action}</pre></div>
            <div className={PlaybackStyles.findElInfo}>
              <div>Strategy: <code>{record.params[0]}</code></div>
              <div>Selector: <code>{JSON.stringify(record.params[1])}</code></div>
            </div>
          </div>;
        } else if (record.action === 'sendKeys') {
          actionStep = <div>
            <div><pre><span>&nbsp;&nbsp;<Icon type="arrow-right" />&nbsp;</span>{record.action}</pre></div>
            <div className={PlaybackStyles.findElInfo}>
              <div><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"{record.params[0]}"</code></div>
            </div>
          </div>;
        } else if (record.action === 'tap') {
          actionStep = <div>
            <div><pre>{record.action}</pre></div>
            <div className={PlaybackStyles.findElInfo}>
              <div><code>[{record.params[0]}, {record.params[1]}]</code></div>
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
    for (let [index, action] of toPairs(this.getActionsToShow())) {
      data.push({
        ...action,
        key: index
      });
    }

    return {data, columns};
  }

  render () {
    const {isTestRunning, hideTestRunModal, serverType} = this.props;
    const sessionId = getSessionId(this.getActionsToShow());
    const showBrowserLink = serverType !== "local" &&
      serverType !== "remote" &&
      serverType !== "browserstack" &&
      serverType !== "testobject";
    const browserUrl = showBrowserLink ? getTestUrl(serverType, sessionId) : null;

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
        <div>
          {(sessionId && showBrowserLink) &&
            <Button onClick={(e) => e.preventDefault() || shell.openExternal(browserUrl)}><Icon type="link" /> Open in Browser</Button>
          }
          <Button onClick={hideTestRunModal} disabled={isTestRunning}>Done</Button>
        </div>
      }
      title={testName}
    >

      {this.getTestHeader()}

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
