import React, { Component } from 'react';
import { Input, Row, Col } from 'antd';
import styles from './Config.css';

export default class Config extends Component {

  render () {
    const {setEnvironmentVariable} = this.props;

    return <div className={styles.container}>
      <h3>Environment Variables</h3>
      <Row className={styles.row} gutter={16}>
        <Col span={24}>
          <Input addonBefore="ANDROID_HOME" onChange={(evt) => setEnvironmentVariable('ANDROID_HOME', evt.target.value)} />
        </Col>
      </Row>
      <Row className={styles.row} gutter={16}>
        <Col span={24}>
          <Input addonBefore="JAVA_HOME" onChange={(evt) => setEnvironmentVariable('JAVA_HOME', evt.target.value)} />
        </Col>
      </Row>
      <Row className={styles.row} gutter={16}>
        <Col span={24}>
          <Input addonBefore="CARTHAGE" onChange={(evt) => setEnvironmentVariable('CARTHAGE', evt.target.value)} />
        </Col>
      </Row>
    </div>;
  }
}
