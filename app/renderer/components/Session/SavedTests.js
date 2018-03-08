import React, { Component } from 'react';
import moment from 'moment';
import formatJSON from 'format-json';
import PlaybackStyles from './Playback.css';
import { Tooltip, Table, Button, Modal } from 'antd';
import { sortedTests } from './shared';

export default class SavedTests extends Component {

  constructor () {
    super();
    this.state = {
      selectedTests: [],
    };
    this.onRowCheckbox = this.onRowCheckbox.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
  }

  onRowClick ({key}) {
    let selectedTests = [...this.state.selectedTests];
    if (selectedTests.indexOf(key) >= 0) {
      selectedTests = [];
    } else {
      selectedTests = [key];
    }
    this.setState({selectedTests});
  }

  onRowCheckbox (selectedTests) {
    selectedTests = selectedTests.filter((t) => {
      return this.state.selectedTests.indexOf(t) === -1;
    });
    this.setState({selectedTests});
  }

  render () {
    const {savedTests, deleteSavedTest, capsModal, showCapsModal, hideCapsModal,
      requestTestRun} = this.props;
    const {selectedTests} = this.state;

    const tests = sortedTests(savedTests);

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
      render: (ts) => `Recorded ${moment(ts).format("MMM DD, YYYY")}`
    }, {
      title: 'Actions',
      key: 'action',
      width: 95,
      render: (text, test) => (
        <div>
          <Tooltip title="Show Capabilities as Recorded">
            <Button
              icon="menu-unfold"
              onClick={() => {showCapsModal(test.testId);}}
            />
          </Tooltip>

          &nbsp;

          <Tooltip title="Delete Test">
            <Button icon="delete" onClick={() => {
              if (confirm(`Delete test '${test.name}'?`)) {
                deleteSavedTest(test.testId);
              }
            }} />
          </Tooltip>

          <Modal visible={capsModal === test.testId}
            footer={
              <Button onClick={hideCapsModal}>Done</Button>
            }
            closable={false}
            title={<div><b>{test.name}</b> capabilities</div>}
            wrapClassName={PlaybackStyles.verticalCenterModal}
          >
            <pre className={PlaybackStyles.capsModalPre}>
              {formatJSON.plain(test.caps)}
            </pre>
          </Modal>
        </div>
      )
    }];

    const data = tests.map((t) => ({...t, key: t.testId}));
    const rowSelection = {
      selectedRowKeys: selectedTests,
      onChange: this.onRowCheckbox
    };

    return <Table
      rowSelection={rowSelection}
      size="small"
      className={PlaybackStyles.savedTestsTable}
      columns={columns}
      showHeader={false}
      dataSource={data}
      pagination={{
        size: "small",
        pageSize: 4,
      }}
      onRowClick={this.onRowClick}
    />;
  }
}
