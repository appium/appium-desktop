import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Row, Col, Button } from 'antd';
import InspectorStyles from './Inspector.css';

export default class LocatedElements extends Component {

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
    const {locatedElements, applyClientMethod, setLocatorTestElement, locatorTestElement, clearSearchResults} = this.props;

    return <Row>
      <p className={InspectorStyles['back-link-container']}>
        <a onClick={(e) => e.preventDefault() || clearSearchResults()}>&lt;&lt; Back</a>
      </p>
      Elements (<span>{locatedElements.length}</span>):
      <Col> 
        <select className={InspectorStyles['locator-search-results']}
          multiple='true'
          onChange={(e) => setLocatorTestElement(e.target.value)} 
          value={[locatorTestElement]}>
          {locatedElements.map((elementId) => (
            <option key={elementId} value={elementId}>{elementId}</option>
          ))}
          {locatedElements.length === 0 && <option disabled>Could not find any elements</option>}
        </select>
        {locatedElements.length > 0 && <div className={InspectorStyles['locator-test-interactions-container']}>
          <div>
            <Button size='small' 
              disabled={!locatorTestElement}
              onClick={() => applyClientMethod({methodName: 'click', elementId: locatorTestElement})}>Tap Element
            </Button>
          </div>
          <div>
            <Button size='small'
              disabled={!locatorTestElement}
              onClick={() => applyClientMethod({methodName: 'clear', elementId: locatorTestElement})}>Clear
            </Button>
          </div>
          <div className={InspectorStyles['send-keys-container']}>
            <Input size='small' placeholder='Enter keys' onChange={(e) => this.setState({...this.state, sendKeys: e.target.value})}/>
            <Button size='small'
              disabled={!locatorTestElement}
              onClick={() => applyClientMethod({methodName: 'sendKeys', elementId: locatorTestElement, args: [this.state.sendKeys || '']})}>Send Keys</Button>
          </div>
        </div>}
      </Col>
    </Row>;
  }
}
