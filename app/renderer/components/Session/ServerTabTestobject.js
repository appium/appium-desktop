import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';

const FormItem = Form.Item;

export default class ServerTabTestobject extends Component {

  render () {

    const {server, setServerParam} = this.props;

    return <Form>
      <FormItem>
        <Input id='testObjectPassword' type='password' placeholder={process.env.TESTOBJECT_API_KEY ? 'Using data found in $TESTOBJECT_API_KEY' : 'testobject-api-key'} addonBefore="TestObject API Key" value={server.testobject.apiKey} onChange={(e) => setServerParam('apiKey', e.target.value)} />
      </FormItem>
      <FormItem>
        <div className="ant-input-wrapper ant-input-group">
          <div className="ant-input-group-addon">TestObject Data Center</div>
          <div className="select-container">
            <Select defaultValue='us1' id='testObjectDataCenter' addonBefore='TestObject Data Center' value={server.testobject.dataCenter} onChange={(value) => setServerParam('dataCenter', value)}>
              <Select.Option value='us1'>US</Select.Option>
              <Select.Option value='eu1'>EU</Select.Option>
            </Select>
          </div>
        </div>
      </FormItem>
    </Form>;
  }
}
