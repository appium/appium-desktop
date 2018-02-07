import React, { Component } from 'react';
import { Form, Row, Col, Input, Checkbox } from 'antd';
const FormItem = Form.Item;

export default class ServerTabSauce extends Component {

  render () {

    const {server, setServerParam} = this.props;

    return <Form>
      <Row type="flex" justify="space-between" align="top">
        <Col span={13}>
          <FormItem>
            <Input id='sauceUsername' placeholder={process.env.SAUCE_USERNAME ? 'Using data found in $SAUCE_USERNAME' : 'your-username'} addonBefore="Sauce Username" value={server.sauce.username} onChange={(e) => setServerParam('username', e.target.value)} />
          </FormItem>
          <FormItem>
            <Input id='saucePassword' type='password' placeholder={process.env.SAUCE_ACCESS_KEY ? 'Using data found in $SAUCE_ACCESS_KEY' : 'your-access-key'} addonBefore="Sauce Access Key" value={server.sauce.accessKey} onChange={(e) => setServerParam('accessKey', e.target.value)} />
          </FormItem>
        </Col>
        <Col span={10}>
          <FormItem>
            <Checkbox checked={!!server.sauce.useSCProxy} onChange={(e) => setServerParam('useSCProxy', e.target.checked)}> Proxy through Sauce Connect's Selenium Relay</Checkbox>
          </FormItem>
          <Row type="flex" justify="space-between" align="top">
            <Col span={11}>
              <FormItem>
                <Input addonBefore="Host" placeholder="localhost" disabled={!server.sauce.useSCProxy} value={server.sauce.scHost} onChange={(e) => setServerParam('scHost', e.target.value)}/>
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem>
                <Input addonBefore="Port" placeholder="4445" disabled={!server.sauce.useSCProxy} value={server.sauce.scPort} onChange={(e) => setServerParam('scPort', e.target.value)} />
              </FormItem>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>;
  }
}

