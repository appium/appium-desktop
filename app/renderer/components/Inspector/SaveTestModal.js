import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, AutoComplete } from 'antd';

export default class SaveTestModal extends Component {

  state = {testName: ""}

  onSubmit () {
    this.props.saveTest(this.state.testName);
    this.props.hideSaveTestModal();
  }

  onCancel () {
    this.props.hideSaveTestModal();
  }

  render () {
    const {saveTestModalVisible, savedTests} = this.props;
    const testNames = savedTests.map((t) => t.name);

    return <Modal visible={saveTestModalVisible}
      okText='Save'
      cancelText='Cancel'
      title='Save recorded actions as a test'
      onOk={this.onSubmit.bind(this)}
      onCancel={this.onCancel.bind(this)}>

      <AutoComplete
        onChange={(value) => this.setState({testName: value})}
        dataSource={testNames}
        placeholder="Test name"
      />
    </Modal>;
  }
}
