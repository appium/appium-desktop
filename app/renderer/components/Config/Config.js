import React, { Component } from 'react';
import { Input, Row, Col } from 'antd';
import styles from './Config.css';

export default class Config extends Component {

  render () {
    return <div className={styles.container}>
      <h3>Environment Variables</h3>
      <Row className={styles.row} gutter={16}>
        <Col span={24}>
          <Input addonBefore="ANDROID_HOME" />
        </Col>
      </Row>
      <Row className={styles.row} gutter={16}>
        <Col span={24}>
          <Input addonBefore="JAVA_HOME" />
        </Col>
      </Row>
      <Row className={styles.row} gutter={16}>
        <Col span={24}>
          <Input addonBefore="CARTHAGE" />
        </Col>
      </Row>
    </div>;
  }
}
