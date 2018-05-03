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

  componentWillMount () {
    const {testToRun} = this.props;
    if (testToRun) {
      this.setState({selectedTests: [testToRun]});
    }
  }

  selectTest (testId) {
    const {selectTestToRun, setCapsFromTest} = this.props;
    const selectedTests = testId ? [testId] : [];
    this.setState({selectedTests});
    selectTestToRun(testId || null);
    if (testId) {
      setCapsFromTest(testId);
    }
  }

  onRowClick ({key}) {
    let selectedTests = [...this.state.selectedTests];
    if (selectedTests.indexOf(key) >= 0) {
      // if the key is already in our list, we need to deselect it
      this.selectTest(null);
    } else {
      this.selectTest(key);
    }
  }

  onRowCheckbox (selectedTests) {
    const selectedTest = selectedTests.filter((t) => {
      return this.state.selectedTests.indexOf(t) === -1;
    })[0];
    this.selectTest(selectedTest);
  }

  render () {
    const {
      savedTests, deleteSavedTest, capsModal, showCapsModal, hideCapsModal,
    } = this.props;
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
      width: 120,
      render: (text, test) => (
        <div>
          <Tooltip title="Show Capabilities as Recorded">
            <Button
              icon="menu-unfold"
              onClick={(e) => {
                e.stopPropagation();
                showCapsModal(test.testId);
              }}
            />
          </Tooltip>

          &nbsp;

          <Tooltip title="Delete Test">
            <Button icon="delete" onClick={(e) => {
              e.stopPropagation();
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
        pageSize: 3,
      }}
      onRowClick={this.onRowClick}
    />;
  }
}
