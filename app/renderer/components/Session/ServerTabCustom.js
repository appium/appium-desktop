import React, { Component } from 'react';
import { Form, Row, Col, Input, Checkbox } from 'antd';
import SessionStyles from './Session.css';

const FormItem = Form.Item;

export default class ServerTabCustom extends Component {

  render () {

    const {server, setServerParam} = this.props;

    return <Form>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='customServerHost' placeholder='127.0.0.1' addonBefore="Remote Host" value={server.remote.hostname} onChange={(e) => setServerParam('hostname', e.target.value)} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem>
            <Input id='customServerPort' placeholder='4723' addonBefore="Remote Port" value={server.remote.port} onChange={(e) => setServerParam('port', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='customServerPath' placeholder='/wd/hub' addonBefore="Remote Path" value={server.remote.path} onChange={(e) => setServerParam('path', e.target.value)} />
          </FormItem>
        </Col>
        <Col span={3}>
          <FormItem>
            <Checkbox id='customServerSSL' checked={!!server.remote.ssl} value={server.remote.ssl} onChange={(e) => setServerParam('ssl', e.target.checked)}>SSL</Checkbox>
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
