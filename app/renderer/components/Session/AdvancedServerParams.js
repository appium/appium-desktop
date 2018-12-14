import React, { Component } from 'react';
import { Collapse, Form, Row, Col, Checkbox, Input } from 'antd';
import styles from './Session.css';

const {Panel} = Collapse;
const FormItem = Form.Item;

export default class AdvancedServerParams extends Component {


  render () {
    const {server, setServerParam} = this.props;

    return <Row gutter={8}>
      <Col>
        <div className={styles.advancedSettingsContainer}>
          <Collapse bordered={true}>
            <Panel header="Advanced Settings">
              <Col span={6}>
                <FormItem>
                  <Checkbox checked={!!server.advanced.allowUnauthorized} onChange={(e) => setServerParam('allowUnauthorized', e.target.checked, 'advanced')}>Allow Unauthorized Certificates</Checkbox>
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  <Checkbox checked={!!server.advanced.useProxy} onChange={(e) => setServerParam('useProxy', e.target.checked, 'advanced')}>Use Proxy</Checkbox>
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem>
                  <Input disabled={!server.advanced.useProxy} onChange={(e) => setServerParam('proxy', e.target.value, 'advanced')} placeholder="Proxy URL" value={server.advanced.proxy} />
                </FormItem>
              </Col>
            </Panel>
          </Collapse>
        </div>
      </Col>
    </Row>
  }
}
