import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, AutoComplete } from 'antd';
import InspectorStyles from './Inspector.css';

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
    const okText = savedTests.filter((t) => t.name === this.state.testName).length > 0 ? 'Save Existing' : 'Save New';

    return <Modal visible={saveTestModalVisible}
      okText={okText}
      cancelText='Cancel'
      title='Save recorded actions as a test'
      onOk={this.onSubmit.bind(this)}
      onCancel={this.onCancel.bind(this)}>

      <AutoComplete
        className={InspectorStyles.saveTestName}
        onChange={(value) => this.setState({testName: value})}
        dataSource={testNames}
        placeholder="Test name"
      />
    </Modal>;
  }
}
