import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'antd';
import SessionStyles from './Session.css';

const FormItem = Form.Item;

export default class ServerTabExperitest extends Component {

  render () {

    const {server, setServerParam, t} = this.props;
    const accessKeyPlaceholder = 'accessKey';
    const placeholderUrl = 'https://example.experitest.com';

    return <Form>
      <Row gutter={8}>
        <Col span={24}>
          <FormItem>
            <Input className={SessionStyles.customServerInputLeft} id='ExperitestServerUrl' placeholder={placeholderUrl}
              addonBefore={t('experitestUrl')} value={server.experitest.url}
              onChange={(evt) => setServerParam('url', evt.target.value)} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={24}>
          <FormItem>
            <Input className={SessionStyles.customServerInputLeft} id='ExperitestServerAccessKey' placeholder={accessKeyPlaceholder}
              addonBefore={t('experitestAccessKey')} value={server.experitest.accessKey}
              onChange={(evt) => setServerParam('accessKey', evt.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
