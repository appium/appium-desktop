import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'antd';
import SessionStyles from './Session.css';

const FormItem = Form.Item;

export default class ServerTabPerfecto extends Component {

  render () {

    const {server, setServerParam, t} = this.props;

    const cloudPerfectoUrl = 'cloud.Perfectomobile.com';

    const perfectoTokenPlaceholder = process.env.PERFECTO_TOKEN ?
      t('usingDataFoundIn', {environmentVariable: 'PERFECTO_TOKEN'}) : t('Add your token');

    return <Form>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input className={SessionStyles.customServerInputLeft} id='PerfectoServerHost' placeholder={cloudPerfectoUrl} addonBefore={t('Perfecto Host')}
              value={server.perfecto.hostname} onChange={(e) => setServerParam('hostname', e.target.value)} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem>
            <Input id='PerfectoPort' placeholder={80} addonBefore={t('Perfecto Port')} value={server.perfecto.port}
              onChange={(e) => setServerParam('port', e.target.value)} />
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem>
            <Input id='token' placeholder={perfectoTokenPlaceholder} addonBefore={t('Perfecto Token')} value={server.perfecto.token} onChange={(e) => setServerParam('token', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
