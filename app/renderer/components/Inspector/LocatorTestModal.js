import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Input, Select, Row, Col, Button } from 'antd';

const { Option } = Select;

export default class LocatorTestModal extends Component {

  render () {
    const {hideLocatorTestModal, isLocatorTestModalVisible, searchForElement, isSearchingForElements, locatedElements, applyClientMethod,
      setLocatorTestValue, locatorTestValue, setLocatorTestStrategy, locatorTestStrategy, setLocatorTestElement, locatorTestElement} = this.props;

    const locatorStrategies = [
      ['id', 'Id'],
      ['xpath', 'XPath'],
      ['name', 'Name'],
      ['class name', 'Class Name'],
      ['accessibility id', 'Accessibility ID'],
      ['-android uiautomator', 'UIAutomator Selector (Android)'],
      ['-ios predicate string', 'Predicate String (iOS)'],
      ['-ios class chain', 'Class Chain (iOS)'],
    ];

    return <Modal visible={isLocatorTestModalVisible} 
      okText='Search'
      cancelText='Cancel'
      title='Search for element'
      confirmLoading={isSearchingForElements}
      onOk={() => searchForElement(locatorTestStrategy, locatorTestValue)}
      onCancel={hideLocatorTestModal}>
        <Row>
          <Col>
            Locator Strategy:
            <Select style={{width: '100%'}} 
              onChange={(value) => setLocatorTestStrategy(value)}
              value={locatorTestStrategy}>
              {locatorStrategies.map(([strategyValue, strategyName]) => (
                <Option key={strategyValue} value={strategyValue}>{strategyName}</Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row>
          Selector:
          <Col>
            <Input onChange={(e) => setLocatorTestValue(e.target.value)} value={locatorTestValue} />
          </Col>
        </Row>
        {locatedElements ? <Row>
          Elements (<span>{locatedElements.length}</span>):
          <Col> 
            <select onChange={(e) => setLocatorTestElement(e.target.value)} value={[locatorTestElement]} style={{width:'100%'}} multiple={true}>
              {locatedElements.map(({value:elementId}) => (
                <option key={elementId} value={elementId}>{elementId}</option>
              ))}
              {locatedElements.length === 0 && <option disabled>Could not find any elements</option>}
            </select>
            {locatedElements.length > 0 && <Button size='small' 
              disabled={!locatorTestElement} 
              style={{float: 'right'}}
              onClick={() => applyClientMethod({methodName: 'clickElement', args: [locatorTestElement]})}>Tap Element
            </Button>}
          </Col>
        </Row> : null}
    </Modal>;
  }
}
