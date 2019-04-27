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
            <Input className={SessionStyles.customServerInputLeft} id='headspinServerHost' placeholder={headspinUrl} addonBefore={t('HeadSpin Web Driver URL')}
              value={server.headspin.webDriverUrl} onChange={(e) => setServerParam('webDriverUrl', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
