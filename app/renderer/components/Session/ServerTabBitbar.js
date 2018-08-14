import React, { Component } from 'react';
import { Form, Input, Row, Col } from 'antd';

const FormItem = Form.Item;

export default class ServerTabBitbar extends Component {

  render () {

    const { server, setServerParam } = this.props;

    return <Form>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='bitbarApiKey' type='password' placeholder={process.env.BITBAR_API_KEY ? 'Using data found in $BITBAR_API_KEY' : 'your-api-key'} addonBefore="Bitbar API Key" value={server.bitbar.apiKey} onChange={(e) => setServerParam('apiKey', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
