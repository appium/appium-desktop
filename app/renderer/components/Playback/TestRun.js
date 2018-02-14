import React, { Component } from 'react';
import { Modal, Table, Button } from 'antd';
import { toPairs } from 'lodash';

export default class TestRun extends Component {

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
    }, {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    }, {
      title: 'Parameters',
      dataIndex: 'params',
      key: 'params',
      render: (params) => {
        if (params.length) {
          return <div>
            {params.filter(Boolean).map((p) => <div>{p}</div>)}
          </div>;
        }
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

    return <Modal
      visible={visible}
      closable={false}
      width={800}
      footer={
        <Button onClick={hideTestRunModal} disabled={isTestRunning}>Done</Button>
      }
      title={testName}
    >
      <Table
        columns={columns}
        showHeader={false}
        dataSource={data}
        pagination={false}
      />
    </Modal>;
  }

}
