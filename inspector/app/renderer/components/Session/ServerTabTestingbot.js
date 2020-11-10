import React, { Component } from 'react';
import { Form, Input, Row, Col } from 'antd';
import { INPUT } from '../../../../../shared/components/AntdTypes';

const FormItem = Form.Item;

export default class ServerTabTestingbot extends Component {

  render () {

    const {server, setServerParam, t} = this.props;

    const testingbotKeyPlaceholder = process.env.TB_KEY ?
      t('usingDataFoundIn', {environmentVariable: 'TB_KEY'}) : t('yourUsername');

    const testingbotSecretPlaceholder = process.env.TB_SECRET ?
      t('usingDataFoundIn', {environmentVariable: 'TB_SECRET'}) : t('yourAccessKey');

    return <Form>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='testingbotKey' placeholder={testingbotKeyPlaceholder} addonBefore={t('TestingBot Key')} value={server.testingbot.key} onChange={(e) => setServerParam('key', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='testingbotSecret' type={INPUT.PASSWORD} placeholder={testingbotSecretPlaceholder} addonBefore={t('TestingBot Secret')} value={server.testingbot.secret} onChange={(e) => setServerParam('secret', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
