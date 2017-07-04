import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Input, Select, Row, Col, Button } from 'antd';

const { Option } = Select;

export default class LocatorTestModal extends Component {

  onSubmit () {
    const {locatedElements, locatorTestStrategy, locatorTestValue, searchForElement, clearSearchResults, hideLocatorTestModal} = this.props;
    if (locatedElements) {
      hideLocatorTestModal();
      clearSearchResults();
    } else {
      searchForElement(locatorTestStrategy, locatorTestValue);
    }
  }

  onCancel () {
    const {hideLocatorTestModal, clearSearchResults} = this.props;
    hideLocatorTestModal();
    clearSearchResults();
  }

  render () {
    const {isLocatorTestModalVisible, isSearchingForElements, locatedElements, applyClientMethod,
      setLocatorTestValue, locatorTestValue, setLocatorTestStrategy, locatorTestStrategy, setLocatorTestElement, locatorTestElement, clearSearchResults} = this.props;

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
      okText={locatedElements ? 'Done' : 'Search'}
      cancelText='Cancel'
      title='Search for element'
      confirmLoading={isSearchingForElements}
      onOk={(() => this.onSubmit()).bind(this)}
      onCancel={(() => this.onCancel()).bind(this)}>
        {!locatedElements && <Row>
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
        </Row>}
        {!locatedElements && <Row>
          Selector:
          <Col>
            <Input onChange={(e) => setLocatorTestValue(e.target.value)} value={locatorTestValue} />
          </Col>
        </Row>}
        {locatedElements && <Row>
          <p style={{marginBottom:'1em'}}>
            <a onClick={(e) => e.preventDefault() || clearSearchResults()}>&lt;&lt; Back</a>
          </p>
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
        </Row>}
    </Modal>;
  }
}
