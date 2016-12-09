import React, { Component } from 'react';
import { Button, Row, Col, Spin } from 'antd';
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
    const { source, isQuittingSession, applyClientMethod, selectedXPath } = this.props;

    return (<div style={{width: '100%'}}>
      <Spin spinning={!!isQuittingSession}>
      <Row>
        <Col span={12}>
          <Source {...this.props} />
        </Col>
        {selectedXPath && <Col span={12}>
          <Row>
            <Col span={24}>
              <Button onClick={() => applyClientMethod({methodName: 'tap', xpath: selectedXPath})}>Click Element</Button>
            </Col>
          </Row>
        </Col>}
      </Row>
      <Row>
        <Col span={12}>

        </Col>
      </Row>
      </Spin>
    </div>);
  }
}
