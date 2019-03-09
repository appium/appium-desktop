import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'antd';
import SessionStyles from './Session.css';

const FormItem = Form.Item;

export default class ServerTabHeadspin extends Component {

  render () {

    const {server, setServerParam, t} = this.props;

    const headspinUrl = 'xxx.headspin.io';
    const fakeHeadspinApiKey = 'f30a3f58c3f842f1aedef457347e1e88';

    return <Form>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input className={SessionStyles.customServerInputLeft} id='headspinServerHost' placeholder={headspinUrl} addonBefore={t('Headspin Host')}
              value={server.headspin.hostname} onChange={(e) => setServerParam('hostname', e.target.value)} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem>
            <Input id='headspinServerPort' placeholder={7200} addonBefore={t('Headspin Port')} value={server.headspin.port}
              onChange={(e) => setServerParam('port', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={24}>
          <FormItem>
            <Input id='headspinApiKey' type='password' placeholder={fakeHeadspinApiKey} addonBefore={t('Headspin API Token')}
              value={server.headspin.apiKey} onChange={(e) => setServerParam('apiKey', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
