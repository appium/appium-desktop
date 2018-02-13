import React, { Component } from 'react';
import PlaybackStyles from './PlaybackLibrary.css';
import { Tooltip, Table, Button } from 'antd';
import moment from 'moment';

export default class SavedTests extends Component {

  render () {
    const {tests, deleteSavedTest} = this.props;

    if (!tests.length) {
      return <div className={PlaybackStyles.noTests}>
        You don't have any tests that can be run. Launch an Inspector session and record a test first!
      </div>;
    }

    const columns = [{
      title: 'Title',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Recorded On',
      dataIndex: 'recordedAt',
      key: 'recordedAt',
      render: (ts) => moment(ts).format("MMM DD, YYYY")
    }, {
      title: 'Actions',
      key: 'action',
      render: (test) => (
        <div>
          <Tooltip title="Run Test">
            <Button icon="caret-right" />
          </Tooltip>

          &nbsp;

          <Tooltip title="Show Capabilities">
            <Button icon="menu-unfold" />
          </Tooltip>

          &nbsp;

          <Tooltip title="Delete Test">
            <Button icon="delete" onClick={() => {
              if (confirm(`Delete test '${test.name}'?`)) {
                deleteSavedTest(test.name);
              }
            }} />
          </Tooltip>
        </div>
      )
    }];

    const data = tests.map((t) => ({name: t.name, key: t.name}));

    return <Table
      className={PlaybackStyles.savedTestsTable}
      columns={columns}
      dataSource={data}
      pagination={false}
    />;
  }
}
