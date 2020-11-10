import React, { Component } from 'react';
import { Form, Input, Row, Col } from 'antd';
import { INPUT } from '../../../../../shared/components/AntdTypes';

const FormItem = Form.Item;

export default class ServerTabBrowserstack extends Component {

  render () {

    const {server, setServerParam, t} = this.props;

    const browserstackUsernamePlaceholder = process.env.BROWSERSTACK_USERNAME ?
      t('usingDataFoundIn', {environmentVariable: 'BROWSERSTACK_USERNAME'}) : t('yourUsername');

    const browserstackAccessKeyPlaceholder = process.env.BROWSERSTACK_ACCESS_KEY ?
      t('usingDataFoundIn', {environmentVariable: 'BROWSERSTACK_ACCESS_KEY'}) : t('yourAccessKey');

    return <Form>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='browserstackUsername' placeholder={browserstackUsernamePlaceholder} addonBefore={t('BrowserStack Username')} value={server.browserstack.username}
              onChange={(e) => setServerParam('username', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='browserstackPassword' type={INPUT.PASSWORD} placeholder={browserstackAccessKeyPlaceholder} addonBefore={t('BrowserStack Access Key')}
              value={server.browserstack.accessKey} onChange={(e) => setServerParam('accessKey', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
