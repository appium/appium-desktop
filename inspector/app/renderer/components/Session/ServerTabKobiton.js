import React, { Component } from 'react';
import { Form, Input, Row, Col } from 'antd';
import { INPUT } from '../../../../../shared/components/AntdTypes';

const FormItem = Form.Item;

export default class ServerTabKobiton extends Component {

  render () {
    const {server, setServerParam, t} = this.props;
    const kobitonUsernamePlaceholder = process.env.KOBITON_USERNAME ?
      t('usingDataFoundIn', {environmentVariable: 'KOBITON_USERNAME'}) : t('yourUsername');

    const kobitonAccessKeyPlaceholder = process.env.KOBITON_ACCESS_KEY ?
      t('usingDataFoundIn', {environmentVariable: 'KOBITON_ACCESS_KEY'}) : t('yourAccessKey');

    return <Form>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='kobitonUsername' placeholder={kobitonUsernamePlaceholder} addonBefore={t('Kobiton Username')} value={server.kobiton.username}
              onChange={(e) => setServerParam('username', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='kobitonAccessKey' type={INPUT.PASSWORD} placeholder={kobitonAccessKeyPlaceholder} addonBefore={t('Kobiton Access Key')} value={server.kobiton.accessKey} onChange={(e) => setServerParam('accessKey', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
