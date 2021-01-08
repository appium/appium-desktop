import React, { Component } from 'react';
import { Form, Input, Row, Col } from 'antd';

const FormItem = Form.Item;
export default class ServerTabRoboticMobi extends Component {
  render () {

    const { server, setServerParam, t } = this.props;

    const placeholder = process.env.ROBOTIC_MOBI_TOKEN ?
      t('usingDataFoundIn', { environmentVariable: 'ROBOTIC_MOBI_TOKEN' }) : t('roboticMobiToken');

    return <Form>
      <Row gutter={8}>
        <Col span={24}>
          <FormItem>
            <Input id='roboticMobiToken' placeholder={placeholder} addonBefore={t('Robotic.Mobi Token')} value={server.roboticmobi.token} onChange={(e) => setServerParam('token', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
    </Form>;
  }
}
