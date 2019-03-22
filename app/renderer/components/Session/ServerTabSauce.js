import React, { Component } from 'react';
import { Form, Row, Col, Input, Checkbox, Radio } from 'antd';
import SessionStyles from './Session.css';
const FormItem = Form.Item;

export default class ServerTabSauce extends Component {

  render () {

    const {server, setServerParam} = this.props;

    return <Form>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='sauceUsername' placeholder={process.env.SAUCE_USERNAME ? 'Using data found in $SAUCE_USERNAME' : 'your-username'} addonBefore="Sauce Username" value={server.sauce.username} onChange={(e) => setServerParam('username', e.target.value)} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem>
            <Input id='saucePassword' type='password' placeholder={process.env.SAUCE_ACCESS_KEY ? 'Using data found in $SAUCE_ACCESS_KEY' : 'your-access-key'} addonBefore="Sauce Access Key" value={server.sauce.accessKey} onChange={(e) => setServerParam('accessKey', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={24}>
          <FormItem>
            <div className={['ant-input-group-addon', SessionStyles.addonDataCenter].join(' ') }>Saucelabs Data Center</div>
            <Radio.Group className={SessionStyles.inputDataCenter} buttonStyle="solid" defaultValue='us-west-1' id='sauceObjectDataCenter' value={server.sauce.dataCenter} onChange={(e) => setServerParam('dataCenter', e.target.value)}>
              <Radio value='us-west-1'>US</Radio>
              <Radio value='eu-central-1'>EU</Radio>
            </Radio.Group>
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={10}>
          <FormItem>
            <Checkbox checked={!!server.sauce.useSCProxy} onChange={(e) => setServerParam('useSCProxy', e.target.checked)}> Proxy through Sauce Connect's Selenium Relay</Checkbox>
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            <Input addonBefore="Host" placeholder="localhost" disabled={!server.sauce.useSCProxy} value={server.sauce.scHost} onChange={(e) => setServerParam('scHost', e.target.value)}/>
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            <Input addonBefore="Port" placeholder="4445" disabled={!server.sauce.useSCProxy} value={server.sauce.scPort} onChange={(e) => setServerParam('scPort', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}

