import React, { Component } from 'react';
import moment from 'moment';
import { Table, Icon, Tooltip, Button } from 'antd';
import PlaybackStyles from './Playback.css';
import { stateDataForTest, sortedResults } from './shared';

export default class TestResults extends Component {

  getResultActions (text, testResult) {
    const {deleteTestResult, showTestResult} = this.props;

    return <div>
      <Tooltip title="Show Test Steps">
        <Button icon="menu-unfold" onClick={() => {showTestResult(testResult.resultId);}} />
      </Tooltip>
      &nbsp;
      <Tooltip title="Delete Result">
        <Button icon="delete" onClick={() => {deleteTestResult(testResult.resultId);}} />
      </Tooltip>
    </div>;
  }

  getTableData () {
    let {testResults} = this.props;
    testResults = sortedResults(testResults);

    const columns = [{
      title: 'Title',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Status',
      key: 'status',
      render: (text, test) => (
        <span style={{color: test.status.color}}>
          <Icon type={test.status.icon} />&nbsp;
          {test.status.text}
        </span>
      )
    }, {
      title: 'Run At',
      dataIndex: 'date',
      key: 'date',
      render: (ts) => moment(ts).format("MMM DD, YYYY HH:MM:SS")
    }, {
      title: 'Server Type',
      dataIndex: 'serverType',
      key: 'serverType',
      render: (text) => <pre>{text}</pre>
    }, {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: this.getResultActions.bind(this)
    }];

    const data = testResults.map((t) => ({
      ...t,
      key: t.resultId,
      status: stateDataForTest(t.actions)
    }));
    return {columns, data};
  }

  render () {
    const {testResults} = this.props;

    if (!testResults.length) {
      return <div className={PlaybackStyles.noTests}>
        You don't have any test results. Run some tests and the results will show up here.
      </div>;
    }

    const {columns, data} = this.getTableData();

    return <Table
      columns={columns}
      dataSource={data}
      pagination={false}
    />;
  }
}
