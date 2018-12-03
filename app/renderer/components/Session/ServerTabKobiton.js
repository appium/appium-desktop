import React, { Component } from 'react';
import { Form, Input, Row, Col } from 'antd';

const FormItem = Form.Item;

export default class ServerTabKobiton extends Component {

  render () {

    const {server, setServerParam} = this.props;

    return <Form>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='kobitonUsername' placeholder={process.env.KOBITON_USERNAME ? 'Using data found in $KOBITON_USERNAME' : 'your-username'} addonBefore="Kobiton Username" value={server.kobiton.username} onChange={(e) => setServerParam('username', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='kobitonAccessKey' type='password' placeholder={process.env.KOBITON_ACCESS_KEY ? 'Using data found in $KOBITON_ACCESS_KEY' : 'your-access-key'} addonBefore="Kobiton Access Key" value={server.kobiton.accessKey} onChange={(e) => setServerParam('accessKey', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
