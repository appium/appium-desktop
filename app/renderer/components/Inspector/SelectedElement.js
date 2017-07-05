import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './Inspector.css';
import { Button, Row, Col, Input, Modal, Table, Alert } from 'antd';

const ButtonGroup = Button.Group;

const STRATEGY_MAPPINGS = {
  name: 'accessibility id',
  "content-desc": 'accessibility id',
  id: 'id',
  "resource-id": 'id',
};

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
    const {sendKeys, applyClientMethod, hideSendKeysModal, selectedElementId:elementId} = this.props;
    applyClientMethod({methodName: 'sendKeys', elementId, args: [sendKeys]});
    hideSendKeysModal();
  }

  render () {
    const {applyClientMethod, setFieldValue, sendKeys, selectedElement, sendKeysModalVisible, showSendKeysModal, 
      hideSendKeysModal, selectedElementId:elementId} = this.props;
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
      width: 100
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

    let findColumns = [{
      title: 'Find By',
      dataIndex: 'find',
      key: 'find',
      width: 100
    }, {
      title: 'Selector',
      dataIndex: 'selector',
      key: 'selector'
    }];

    let findDataSource = [], showXpathWarning = false;

    for (let key of Object.keys(STRATEGY_MAPPINGS)) {
      if (attributes[key]) {
        findDataSource.push({
          key: STRATEGY_MAPPINGS[key],
          find: STRATEGY_MAPPINGS[key],
          selector: attributes[key]
        });
      }
    }

    if (!findDataSource.length && xpath) {
      findDataSource.push({
        key: 'xpath',
        find: 'xpath',
        selector: xpath,
      });
      showXpathWarning = true;
    }

    return <div>
      <Row justify="center" type="flex" align="middle" gutter={10} className={styles.elementActions}>
        <Col>
          <ButtonGroup size="small">
            <Button disabled={!elementId} id='btnTapElement' onClick={() => applyClientMethod({methodName: 'click', elementId})}>Tap</Button>
            <Button disabled={!elementId} id='btnSendKeysToElement' onClick={() => showSendKeysModal()}>Send Keys</Button>
            <Button disabled={!elementId} id='btnClearElement' onClick={() => applyClientMethod({methodName: 'clear', elementId})}>Clear</Button>
          </ButtonGroup>
        </Col>
      </Row>
      {findDataSource.length > 0 && <Table columns={findColumns} dataSource={findDataSource} size="small" pagination={false} />}
      <br />
      {showXpathWarning &&
        <div>
          <Alert
           message="Using XPath locators is not recommended and can lead to fragile tests. Ask your development team to provide unique accessibility locators instead!"
           type="warning"
           showIcon
          />
          <br />
        </div>
      }
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
