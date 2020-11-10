import React, { Component } from 'react';
import { Form, Input, Radio, Row, Col } from 'antd';
import SessionStyles from './Session.css';
import { INPUT } from '../../../../../shared/components/AntdTypes';

const FormItem = Form.Item;

export default class ServerTabTestobject extends Component {

  render () {

    const {server, setServerParam, t} = this.props;

    const placeholder = process.env.TESTOBJECT_API_KEY ?
      t('usingDataFoundIn', {environmentVariable: 'TESTOBJECT_API_KEY'}) : t('testobjectApiKey');

    return <Form>
      <Row gutter={8}>
        <Col span={24}>
          <FormItem>
            <Input id='testObjectPassword' type={INPUT.PASSWORD} placeholder={placeholder} addonBefore={t('TestObject API Key')} value={server.testobject.apiKey} onChange={(e) => setServerParam('apiKey', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={24}>
          <FormItem>
            <div className={['ant-input-group-addon', SessionStyles.addonDataCenter].join(' ') }>{t('TestObject Data Center')}</div>
            <Radio.Group className={SessionStyles.inputDataCenter} buttonStyle="solid" defaultValue='us1' id='testObjectDataCenter' value={server.testobject.dataCenter} onChange={(e) => setServerParam('dataCenter', e.target.value)}>
              <Radio value='us1'>{t('US')}</Radio>
              <Radio value='eu1'>{t('EU')}</Radio>
            </Radio.Group>
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
