import React, { Component } from 'react';
import { Form, Row, Col, Input, Checkbox, Radio, Tooltip } from 'antd';
import SessionStyles from './Session.css';
import { INPUT } from '../AntdTypes';
const FormItem = Form.Item;

export default class ServerTabSauce extends Component {

  render () {

    const {server, setServerParam, t} = this.props;

    const sauceUsernamePlaceholder = process.env.SAUCE_USERNAME ?
      t('usingDataFoundIn', {environmentVariable: 'SAUCE_USERNAME'}) : t('yourUsername');

    const sauceAccessKeyPlaceholder = process.env.SAUCE_ACCESS_KEY ?
      t('usingDataFoundIn', {environmentVariable: 'SAUCE_ACCESS_KEY'}) : t('yourAccessKey');

    return <Form>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='sauceUsername' placeholder={sauceUsernamePlaceholder} addonBefore={t('Sauce Username')} value={server.sauce.username} onChange={(e) => setServerParam('username', e.target.value)} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem>
            <Input id='saucePassword' type={INPUT.PASSWORD} placeholder={sauceAccessKeyPlaceholder}
              addonBefore={t('Sauce Access Key')} value={server.sauce.accessKey} onChange={(e) => setServerParam('accessKey', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={24}>
          <FormItem>
            <div className={['ant-input-group-addon', SessionStyles.addonDataCenter].join(' ') }>{t('SauceLabs Data Center')}</div>
            <Radio.Group className={[SessionStyles.inputDataCenter, SessionStyles.addonDataCenterRadioContainer].join(' ')} buttonStyle="solid" defaultValue='us-west-1' id='sauceObjectDataCenter' value={server.sauce.dataCenter} onChange={(e) => setServerParam('dataCenter', e.target.value)}>
              <Tooltip placement="top" title={t('UP')}>
                <Radio value='us-west-1'>{t('US')}</Radio>
              </Tooltip>
              <Radio value='eu-central-1'>{t('EU')}</Radio>
            </Radio.Group>
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={10}>
          <FormItem>
            <Checkbox checked={!!server.sauce.useSCProxy} onChange={(e) => setServerParam('useSCProxy', e.target.checked)}> {t('proxyThroughSC')}</Checkbox>
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            <Input addonBefore={t('Host')} placeholder={t('localhost')} disabled={!server.sauce.useSCProxy} value={server.sauce.scHost} onChange={(e) => setServerParam('scHost', e.target.value)}/>
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            <Input addonBefore={t('Port')} placeholder={4445} disabled={!server.sauce.useSCProxy} value={server.sauce.scPort} onChange={(e) => setServerParam('scPort', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
