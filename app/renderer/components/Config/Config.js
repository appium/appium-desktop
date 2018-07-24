import { ipcRenderer, remote } from 'electron';
import React, { Component } from 'react';
import { Input, Row, Col, Button } from 'antd';
import styles from './Config.css';

const {app, dialog, getCurrentWindow} = remote;

export default class Config extends Component {

  componentWillMount () {
    this.props.getEnvironmentVariables();
  }

  saveAndRestart () {
    const {environmentVariables} = this.props;
    ipcRenderer.send('appium-save-env', environmentVariables);
    ipcRenderer.once('appium-save-env-done', () => {
      const message = `Application must be restarted for changes to take effect`;
      const dialogOptions = {type: 'info', buttons: ['Restart Now', 'Restart Later'], message};
      dialog.showMessageBox(dialogOptions, (response) => {
        if (response === 0) {
          // If 'Restart Now' restart the application
          app.relaunch();
          app.exit();
        } else {
          // ...otherwise, just close the current window
          getCurrentWindow().close();
        }
      });
    });
  }

  render () {
    const {setEnvironmentVariable, environmentVariables, defaultEnvironmentVariables} = this.props;

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
              value={environmentVariables[ENV_NAME]}  />
          </Col>
        </Row>
      ))}
      <Row>
        <Col span={24}>
          <Button onClick={() => this.saveAndRestart()}>Save and Restart</Button>
        </Col>
      </Row>
    </div>;
  }
}
