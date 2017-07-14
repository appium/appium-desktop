import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Select, Row, Col } from 'antd';
import InspectorStyles from './Inspector.css';

const { Option } = Select;

export default class ElementLocator extends Component {

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
    const {setLocatorTestValue, locatorTestValue, setLocatorTestStrategy, locatorTestStrategy} = this.props;

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

    return <div>
        <Row>
          <Col>
            Locator Strategy:
            <Select className={InspectorStyles['locator-strategy-selector']}
              onChange={(value) => setLocatorTestStrategy(value)}
              value={locatorTestStrategy}>
              {locatorStrategies.map(([strategyValue, strategyName]) => (
                <Option key={strategyValue} value={strategyValue}>{strategyName}</Option>
              ))}
            </Select>
          </Col>
        </Row> <Row>
          Selector:
          <Col>
            <Input onChange={(e) => setLocatorTestValue(e.target.value)} value={locatorTestValue} />
          </Col>
        </Row>
      </div>;
  }
}
