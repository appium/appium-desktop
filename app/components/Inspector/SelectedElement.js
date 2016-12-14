import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Row, Col, Input } from 'antd';

export default class SelectedElement extends Component {

  render () {
    const {applyClientMethod, setInputValue, sendKeys, selectedPath} = this.props;

    const {attributes} = this.props.selectedNode || {};

    // Translate dot separated path to xpath
    let xpath = '';
    if (selectedPath) {
      for (let index of selectedPath.split('.')) {
        xpath += `//*[${parseInt(index) + 1}]`;
      }
    }


    // Translate attributes into an array so we can iterate over it
    let attrArray = Object.keys(attributes || {}).map((attrName) => {
      return {
        name: attrName,
        value: attributes[attrName],
      };
    });

    return <Row style={{paddingTop: '1em'}}>
      <Col span={12}>
        <Button onClick={() => applyClientMethod({methodName: 'tap', xpath})}>Tap Element</Button>
      </Col>
      <Col span={12} style={{height: 400}}>
        <table>
            <tbody>
            {attrArray.map((attr) => <td>{attr.name}: {attr.value}</td> )}
            </tbody>
        </table>
        <Input placeholder='Hostname' value={sendKeys} onChange={(e) => setInputValue('sendKeys', e.target.value)} />
        <Button onClick={() => applyClientMethod({methodName: 'sendKeys', xpath})}>Send Keys</Button>
      </Col>
    </Row>;
  }
}
