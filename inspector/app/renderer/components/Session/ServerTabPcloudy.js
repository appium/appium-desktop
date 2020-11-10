import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'antd';
import SessionStyles from './Session.css';
import { INPUT } from '../../../../../shared/components/AntdTypes';

const FormItem = Form.Item;

export default class ServerTabPcloudy extends Component {

  render () {

    const {server, setServerParam, t} = this.props;

    const pcloudyUsernamePlaceholder = 'username@pcloudy.com';
    const pcloudyHostPlaceholder = 'cloud.pcloudy.com';
    const pcloudyAccessKeyExample = 'kjdgtdwn65fdasd78uy6y';

    return <Form>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input className={SessionStyles.customServerInputLeft} id='PcloudyServerHost' placeholder={pcloudyHostPlaceholder} addonBefore={t('Pcloudy Host')}
              value={server.pcloudy.hostname} onChange={(e) => setServerParam('hostname', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <FormItem>
            <Input id='username' type={INPUT.TEXT} placeholder={pcloudyUsernamePlaceholder} addonBefore={t('Pcloudy User Name')} value={server.pcloudy.username} onChange={(e) => setServerParam('username', e.target.value)} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem>
            <Input id='accessKey' type={INPUT.PASSWORD} placeholder={pcloudyAccessKeyExample} addonBefore={t('Pcloudy API Key')}
              value={server.pcloudy.accessKey} onChange={(e) => setServerParam('accessKey', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
