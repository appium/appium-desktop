import React, { Component } from 'react';
import { Form, Input, Row, Col } from 'antd';

const FormItem = Form.Item;

export default class ServerTabTestingbot extends Component {

  render () {

    const {server, setServerParam} = this.props;

    return <Form>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='testingbotKey' placeholder={process.env.TB_KEY ? 'Using data found in $TB_KEY' : 'your-username'} addonBefore="TestingBot Key" value={server.testingbot.key} onChange={(e) => setServerParam('key', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='testingbotSecret' type='password' placeholder={process.env.TB_SECRET ? 'Using data found in $TB_SECRET' : 'Your TB Secret'} addonBefore="TestingBot Secret" value={server.testingbot.secret} onChange={(e) => setServerParam('secret', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
