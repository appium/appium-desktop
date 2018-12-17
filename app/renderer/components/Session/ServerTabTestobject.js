import React, { Component } from 'react';
import { Form, Input, Radio, Row, Col } from 'antd';
import SessionStyles from './Session.css';

const FormItem = Form.Item;

export default class ServerTabTestobject extends Component {

  render () {

    const {server, setServerParam} = this.props;

    return <Form>
      <Row gutter={8}>
        <Col span={24}>
          <FormItem>
            <Input id='testObjectPassword' type='password' placeholder={process.env.TESTOBJECT_API_KEY ? 'Using data found in $TESTOBJECT_API_KEY' : 'testobject-api-key'} addonBefore="TestObject API Key" value={server.testobject.apiKey} onChange={(e) => setServerParam('apiKey', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={24}>
          <FormItem>
            <div className={["ant-input-group-addon", SessionStyles.addonDataCenter].join(' ') }>TestObject Data Center</div>
            <Radio.Group className={SessionStyles.inputDataCenter} buttonStyle="solid" defaultValue='us1' id='testObjectDataCenter' value={server.testobject.dataCenter} onChange={(e) => setServerParam('dataCenter', e.target.value)}>
              <Radio value='us1'>US</Radio>
              <Radio value='eu1'>EU</Radio>
            </Radio.Group>
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
