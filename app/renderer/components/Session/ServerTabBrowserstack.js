import React, { Component } from 'react';
import { Form, Input, Row, Col } from 'antd';

const FormItem = Form.Item;

export default class ServerTabBrowserstack extends Component {

  render () {

    const {server, setServerParam} = this.props;

    return <Form>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='browserstackUsername' placeholder={process.env.BROWSERSTACK_USERNME ? 'Using data found in $BROWSERSTACK_USERNAME' : 'your-username'} addonBefore="BrowserStack Username" value={server.browserstack.username} onChange={(e) => setServerParam('username', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='browserstackPassword' type='password' placeholder={process.env.BOWSERSTACK_ACCESS_KEY ? 'Using data found in $BROWSERSTACK_ACCESS_KEY' : 'your-access-key'} addonBefore="BrowserStack Access Key" value={server.browserstack.accessKey} onChange={(e) => setServerParam('accessKey', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
