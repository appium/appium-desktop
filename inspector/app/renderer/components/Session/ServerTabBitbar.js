import React, { Component } from 'react';
import { Form, Input, Row, Col } from 'antd';
import { INPUT } from '../../../../../shared/components/AntdTypes';

const FormItem = Form.Item;

export default class ServerTabBitbar extends Component {

  render () {
    const { server, setServerParam, t } = this.props;

    const bitbarApiKeyPlaceholder = process.env.BITBAR_API_KEY ?
      t('usingDataFoundIn', {environmentVariable: 'BITBAR_API_KEY'}) : t('yourApiKey');

    return <Form>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='bitbarApiKey' type={INPUT.PASSWORD} placeholder={bitbarApiKeyPlaceholder} addonBefore={t('Bitbar API Key')}
              value={server.bitbar.apiKey} onChange={(e) => setServerParam('apiKey', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
