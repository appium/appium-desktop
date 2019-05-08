import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'antd';
import SessionStyles from './Session.css';

const FormItem = Form.Item;

export default class ServerTabHeadspin extends Component {

  render () {

    const {server, setServerParam, t} = this.props;

    const headspinUrl = 'https://xxxx.headspin.io:4723/v0/your-api-token/wd/hub';
    return <Form>
      <Row gutter={8}>
        <Col span={24}>
          <FormItem>
            <Input className={SessionStyles.customServerInputLeft} id='headspinServerHost' placeholder={headspinUrl} addonBefore={t('serverTabHeasdpinWebDriverURL')}
              value={server.headspin.webDriverUrl} onChange={(e) => setServerParam('webDriverUrl', e.target.value)} />
            <p className={SessionStyles.localDesc}>{t('sessionHeadspinWebDriverURLDescription')}</p>
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
