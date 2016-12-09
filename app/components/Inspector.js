import React, { Component } from 'react';
import { Button, Row, Col, Spin } from 'antd';
import Source from './Inspector/Source';
import styles from './Session.css';

export default class Inspector extends Component {

  componentWillMount () {
    this.props.applyClientMethod('source');
    this.props.bindSessionDone();
  }

  getDataURI (base64) {
    return `data:image/gif;base64,${base64}`;
  }

  render () {
    const { quitSession, screenshot, isQuittingSession, applyClientMethod, selectedXPath } = this.props;

    return (<Spin spinning={!!isQuittingSession}>
      <Row>
        <Col span={12}>
          <div style={{overflow: 'scroll'}}>
            <Source {...this.props} />
          </div>
        </Col>
        <Col span={12}>
          {screenshot && <img style={{width:'100%'}} src={this.getDataURI(screenshot)} />}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Button onClick={quitSession} icon='cancel'>Quit</Button>
        </Col>
      </Row>
      <Button onClick={() => applyClientMethod({methodName: 'click', xpath: selectedXPath})} />
    </Spin>);
  }
}
