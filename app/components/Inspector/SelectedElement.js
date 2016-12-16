import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Row, Col, Input } from 'antd';

/**
 * Shows details of the currently selected element and shows methods that can
 * be called on the elements (tap, sendKeys)
 */
export default class SelectedElement extends Component {

  render () {
    const {applyClientMethod, setFieldValue, sendKeys, selectedPath, selectedElement} = this.props;
    const {attributes} = selectedElement;

    // Translate dot separated path to xpath
    let xpath = '';
    if (selectedPath) {
      for (let index of selectedPath.split('.')) {
        xpath += `//*[${parseInt(index, 10) + 1}]`;
      }
    }

    // Translate attributes into an array so we can iterate over them
    let attrArray = Object.keys(attributes || {}).map((attrName) => {
      return {
        name: attrName,
        value: attributes[attrName],
      };
    });

    return <div>
      <h4>Attributes</h4>
      <Row>
        <Col span={12}>
        {attrArray.map((attr) => [
          <div>{attr.name}:  {attr.value}</div>,
        ])}
        </Col>
        <Col span={12}>
          <Button onClick={() => applyClientMethod({methodName: 'tap', xpath})}>Tap Element</Button>
          <Input placeholder='Enter keys' value={sendKeys} onChange={(e) => setFieldValue('sendKeys', e.target.value)} />
          <Button onClick={() => applyClientMethod({methodName: 'sendKeys', xpath, args: [sendKeys]})}>Send Keys</Button>
        </Col>
      </Row>
    </div>;
  }
}
