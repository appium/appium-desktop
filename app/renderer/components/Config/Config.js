import React, { Component } from 'react';
import { Input, Row, Col } from 'antd';
import styles from './Config.css';

export default class Config extends Component {

  componentWillMount () {
    this.props.getEnvironmentVariables();
  }

  render () {
    const {setEnvironmentVariable, environmentVariables:env, defaultEnvironmentVariables} = this.props;

    const ENV_VARIABLE_NAMES = [
      'ANDROID_HOME', 'JAVA_HOME'
    ];

    return <div className={styles.container}>
      <h3>Environment Variables</h3>
      {ENV_VARIABLE_NAMES.map((ENV_NAME) => (
        <Row key={ENV_NAME} className={styles.row} gutter={16}>
          <Col span={24}>
            <Input addonBefore={ENV_NAME} 
              placeholder={defaultEnvironmentVariables[ENV_NAME]}
              onChange={(evt) => setEnvironmentVariable(ENV_NAME, evt.target.value)} 
              value={env[ENV_NAME]}  />
          </Col>
        </Row>
      ))}
    </div>;
  }
}
