import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Row, Col, Input, Modal } from 'antd';

/**
 * Shows details of the currently selected element and shows methods that can
 * be called on the elements (tap, sendKeys)
 */
export default class SelectedElement extends Component {

  constructor (props) {
    super(props);
    this.handleSendKeys = this.handleSendKeys.bind(this);
  }

  handleSendKeys () {
    const {sendKeys, applyClientMethod, hideSendKeysModal, selectedElement} = this.props;
    const {xpath} = selectedElement;
    applyClientMethod({methodName: 'sendKeys', xpath, args: [sendKeys]});
    hideSendKeysModal();
  }

  render () {
    const {applyClientMethod, setFieldValue, sendKeys, selectedElement, sendKeysModalVisible, showSendKeysModal, hideSendKeysModal} = this.props;
    const {attributes, xpath} = selectedElement;

    // Translate attributes into an array so we can iterate over them
    let attrArray = Object.keys(attributes || {}).map((attrName) => {
      return {
        name: attrName,
        value: attributes[attrName],
      };
    });

    return <div>
      <h4>Actions</h4>
      <Row>
        <Col span={12}>
          <Button onClick={() => applyClientMethod({methodName: 'click', xpath})}>Tap Element</Button>
        </Col>
        <Col span={12}>
          <Button onClick={() => showSendKeysModal()}>Send Keys</Button>
        </Col>
      </Row>
      <h4>Attributes</h4>
      <Row>
        <Col span={12}>
        {attrArray.map((attr) => [
          <div>{attr.name}:  {attr.value}</div>
        ])}
        </Col>
      </Row>
      <Modal title='Send Keys'
        visible={sendKeysModalVisible}
        okText='Send Keys'
        cancelText='Cancel' 
        onCancel={hideSendKeysModal} 
        onOk={this.handleSendKeys}>
            <Input placeholder='Enter keys' value={sendKeys} onChange={(e) => setFieldValue('sendKeys', e.target.value)} />
      </Modal>
    </div>;
  }
}
