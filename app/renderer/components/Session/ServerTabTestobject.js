import React, { Component } from 'react';
import { Form, Input, Radio, Row, Col } from 'antd';

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
            <div class="ant-input-group-addon" style={{"height": "32px", "border-right": "1", "border-right-style": "solid"}}>TestObject Data Center</div>
            <Radio.Group style={{"margin-left": "8px"}} buttonStyle="solid" defaultValue='us1' id='testObjectDataCenter' value={server.testobject.dataCenter} onChange={(e) => setServerParam('dataCenter', e.target.value)}>
              <Radio value='us1'>US</Radio>
              <Radio value='eu1'>EU</Radio>
            </Radio.Group>
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
