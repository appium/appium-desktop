import React, { Component } from 'react';
import { Form, Row, Col, Input, Checkbox } from 'antd';

const FormItem = Form.Item;

export default class ServerTabCustom extends Component {

  render () {

    const {server, setServerParam, t} = this.props;

    const localhostIp = '127.0.0.1';
    const defaultServerPath = '/wd/hub';

    return <Form>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='customServerHost' placeholder={localhostIp} addonBefore={t('Remote Host')} value={server.remote.hostname}
              onChange={(e) => setServerParam('hostname', e.target.value)} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem>
            <Input id='customServerPort' placeholder={4723} addonBefore={t('Remote Port')} value={server.remote.port}
              onChange={(e) => setServerParam('port', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='customServerPath' placeholder={defaultServerPath} addonBefore={t('Remote Path')} value={server.remote.path}
              onChange={(e) => setServerParam('path', e.target.value)} />
          </FormItem>
        </Col>
        <Col span={3}>
          <FormItem>
            <Checkbox id='customServerSSL' checked={!!server.remote.ssl} value={server.remote.ssl} onChange={(e) => setServerParam('ssl', e.target.checked)}>{t('SSL')}</Checkbox>
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
