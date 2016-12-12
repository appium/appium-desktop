import React, { Component } from 'react';
import { Button, Row, Col, Spin, Input, Card } from 'antd';
import Source from './Inspector/Source';
import styles from './Session.css';

export default class Inspector extends Component {

  componentWillMount () {
    this.props.applyClientMethod({methodName: 'source'});
    this.props.bindSessionDone();
  }

  getDataURI (base64) {
    return `data:image/gif;base64,${base64}`;
  }

  render () {
    const { applyClientMethod, selectedNode, methodCallRequested, setInputValue, sendKeys } = this.props;
    const { selectedXPath } = selectedNode || {};

    return (<div style={{width: '100%', padding: '1em'}}>
      <Row gutter={16}>
        <Col span={12}>
          <Card style={{minHeight: 800}} loading={!!methodCallRequested} title='Source'>
            <Button icon='reload' onClick={() => applyClientMethod({methodName: 'source'})}></Button>
            <Source {...this.props} />
          </Card>
        </Col>
        <Col span={12}>
          <Row>
            <Col span={24}>
            <Card style={{minHeight: 800}}>
              {selectedXPath && <Row>
                <Col span={12}>
                  <Button onClick={() => applyClientMethod({methodName: 'tap', xpath: selectedXPath})}>Tap Element</Button>
                </Col>
                <Col span={12}>
                  <Input placeholder='Hostname' value={sendKeys} onChange={(e) => setInputValue('sendKeys', e.target.value)} />
                  <Button onClick={() => applyClientMethod({methodName: 'sendKeys', xpath: selectedXPath})}>Send Keys</Button>
                </Col>
              </Row>}
            </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={12}>

        </Col>
      </Row>
    </div>);
  }
}
