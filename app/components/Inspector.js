import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Row, Col, Input, Card } from 'antd';
import Source from './Inspector/Source';
import Screenshot from './Inspector/Screenshot';

export default class Inspector extends Component {

  componentWillMount () {
    this.props.applyClientMethod({methodName: 'source'});
    this.props.bindSessionDone();
  }

  render () {
    const {applyClientMethod, methodCallRequested, setInputValue, sendKeys, screenshot, selectedPath} = this.props;

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

    return (<div style={{width: '100%', padding: '1em'}}>
      <Row gutter={16}>
        <Col span={12}>
          <Card style={{height: 800}} loading={!!methodCallRequested} title='Source'>
            <div style={{height: selectedPath ? 400 : 800, overflow: 'scroll', borderBottom: '1px solid black'}}>
              <Button icon='reload' onClick={() => applyClientMethod({methodName: 'source'})}></Button>
              <Source {...this.props} />
            </div>
            {selectedPath && <Row style={{paddingTop: '1em'}}>
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
            </Row>}
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{height: 800}} loading={!!methodCallRequested}>
            <div style={{position: 'relative'}}>
              {screenshot && <Screenshot {...this.props} />}
            </div>
          </Card>
        </Col>
      </Row>
    </div>);
  }
}
