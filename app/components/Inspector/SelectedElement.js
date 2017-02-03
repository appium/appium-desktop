import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from '../Inspector.css';
import { Button, Row, Col, Input, Modal, Table } from 'antd';

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
    let attrArray = Object
      .keys(attributes || {})
      .filter((attrName) => attrName !== 'path')
      .map((attrName) => {
        return {
          name: attrName,
          value: attributes[attrName],
        };
      });

    let columns = [{
      title: 'Attribute',
      dataIndex: 'name',
      key: 'name',
      width: 80
    }, {
      title: 'Value',
      dataIndex: 'value',
      key: 'value'
    }];

    let dataSource = attrArray.map((attr) => {
      return {
        key: attr.name,
        name: attr.name,
        value: attr.value,
      };
    });

    return <div>
      <Row justify="center" type="flex" align="middle" gutter={10} className={styles.elementActions}>
        <Col><Button onClick={() => applyClientMethod({methodName: 'click', xpath})}>Tap</Button></Col>
        <Col><Button onClick={() => showSendKeysModal()}>Send Keys</Button></Col>
      </Row>
      {dataSource.length > 0 &&
      <Row>
        <Table columns={columns} dataSource={dataSource} size="small" pagination={false} />
      </Row>
      }
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
