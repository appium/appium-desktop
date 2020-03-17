import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'antd';
import SessionStyles from './Session.css';


const FormItem = Form.Item;

const accessKeyPlaceholder = 'accessKey';
export default class ServerTabExperitest extends Component {

  render () {

    const {server, setServerParam, t} = this.props;

    const placeholderUrl = 'https://example.experitest.com';

    return <Form>
      <Row gutter={8}>
        <Col span={24}>
          <FormItem>
            <Input className={SessionStyles.customServerInputLeft} id='ExperitestServerUrl' placeholder={placeholderUrl}
              addonBefore={t('Experitest Url')} value={server.experitest.url}
              onChange={(e) => setServerParam('url', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={24}>
          <FormItem>
            <Input className={SessionStyles.customServerInputLeft} id='ExperitestServerAccessKey' placeholder={accessKeyPlaceholder}
              addonBefore={t('Experitest AccessKey')} value={server.experitest.accessKey}
              onChange={(e) => setServerParam('accessKey', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
