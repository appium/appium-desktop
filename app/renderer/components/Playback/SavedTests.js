import React, { Component } from 'react';
import formatJSON from 'format-json';
import PlaybackStyles from './PlaybackLibrary.css';
import { Tooltip, Table, Button, Modal } from 'antd';
import moment from 'moment';

export default class SavedTests extends Component {

  render () {
    const {savedTests, deleteSavedTest, capsModal, showCapsModal, hideCapsModal,
      getCapsObject, requestTestRun} = this.props;

    if (!savedTests.length) {
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
      render: (text, test) => (
        <div>
          <Tooltip title="Run Test">
            <Button icon="caret-right"
              onClick={() => {requestTestRun(test.name);}}
            />
          </Tooltip>

          &nbsp;

          <Tooltip title="Show Capabilities">
            <Button
              icon="menu-unfold"
              onClick={() => {showCapsModal(test.name);}}
            />
          </Tooltip>

          &nbsp;

          <Tooltip title="Delete Test">
            <Button icon="delete" onClick={() => {
              if (confirm(`Delete test '${test.name}'?`)) {
                deleteSavedTest(test.name);
              }
            }} />
          </Tooltip>

          <Modal visible={capsModal === test.name}
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

    const data = savedTests.reverse().map((t) => ({name: t.name, key: t.name, caps: t.caps}));

    return <Table
      className={PlaybackStyles.savedTestsTable}
      columns={columns}
      showHeader={false}
      dataSource={data}
      pagination={false}
    />;
  }
}
