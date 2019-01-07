import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'antd';
import SessionStyles from './Session.css';

const FormItem = Form.Item;

export default class ServerTabPerfecto extends Component {

  render () {

    const {server, setServerParam} = this.props;

    return <Form>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input className={SessionStyles.customServerInputLeft} id='PerfectoServerHost' placeholder='cloud.Perfectomobile.com' addonBefore="Perfecto Host" value={server.perfecto.hostname} onChange={(e) => setServerParam('hostname', e.target.value)} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem>
            <Input id='PerfectoPort' placeholder='80' addonBefore="Perfecto Port" value={server.perfecto.port} onChange={(e) => setServerParam('port', e.target.value)} />
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem>
            <Input id='token' placeholder={process.env.PERFECTO_TOKEN ? 'Using data found in PERFECTO_TOKEN' : 'Add your token'} addonBefore="Perfecto Token" value={server.perfecto.token} onChange={(e) => setServerParam('token', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
