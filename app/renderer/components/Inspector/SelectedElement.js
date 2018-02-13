import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { getLocators } from './shared';
import styles from './Inspector.css';
import { Button, Row, Col, Input, Modal, Table, Alert, Spin } from 'antd';

const ButtonGroup = Button.Group;

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
      hideSendKeysModal, selectedElementId:elementId, sourceXML, elementInteractionsNotAvailable} = this.props;
    const {attributes, xpath} = selectedElement;

    // Get the columns for the attributes table
    let attributeColumns = [{
      title: 'Attribute',
      dataIndex: 'name',
      key: 'name',
      width: 100
    }, {
      title: 'Value',
      dataIndex: 'value',
      key: 'value'
    }];

    // Get the data for the attributes table
    let attrArray = _.toPairs(attributes).filter(([key]) => key !== 'path');
    let dataSource = attrArray.map(([key, value]) => ({
      key,
      value,
      name: key,
    }));

    // Get the columns for the strategies table
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

    // Get the data for the strategies table
    let findDataSource = _.toPairs(getLocators(attributes, sourceXML)).map(([key, selector]) => ({
      key,
      selector,
      find: key,
    }));

    // If XPath is the only provided data source, warn the user about it's brittleness
    let showXpathWarning = false;
    if (findDataSource.length === 0) {
      showXpathWarning = true;
    }

    // Add XPath to the data source as well
    if (xpath) {
      findDataSource.push({
        key: 'xpath',
        find: 'xpath',
        selector: xpath,
      });
    }

    return <div>
      {elementInteractionsNotAvailable && <Row type="flex" gutter={10}>
        <Col>
          <Alert type="info" message="Interactions are not available for this element" showIcon />
        </Col>
      </Row>}
      <Row justify="center" type="flex" align="middle" gutter={10} className={styles.elementActions}>
        <Col>
          <ButtonGroup size="small">
            <Button disabled={!elementId} icon={(!elementInteractionsNotAvailable && !elementId) ? 'loading' : ''} id='btnTapElement' onClick={() => applyClientMethod({methodName: 'click', elementId})}>Tap</Button>
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
        <Table columns={attributeColumns} dataSource={dataSource} size="small" pagination={false} />
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
