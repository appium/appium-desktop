import React, { Component } from 'react';
import { Button, Row, Col } from 'antd';
import styles from './Session.css';

export default class Inspector extends Component {

  componentWillMount () {
    this.props.applyClientMethod('source');
  }

  getDataURI (base64) {
    return `data:image/gif;base64,${base64}`;
  }

  render () {
    const { goBackToNewSessionPage, source, screenshot } = this.props;

    return (
      <Row>
        <Col span={12}>
          <p>{source}</p>
        </Col>
        <Col span={12}>
          <img style={{width:'100%'}} src={this.getDataURI(screenshot)} />
        </Col>
      </Row>
    );
  }
}
