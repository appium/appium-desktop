import React, { Component } from 'react';
import { Form, Card } from 'antd';
import SessionStyles from './Session.css';

const FormItem = Form.Item;

export default class ServerTabSauce extends Component {

  render () {

    const {server, t} = this.props;

    const hostname = `http://${server.local.hostname === '0.0.0.0' ? 'localhost' : server.local.hostname}:${server.local.port}`;

    return <Form>
      <FormItem>
        <Card>
          {server.local.port && <p className={SessionStyles.localDesc}>{t('willUseCurrentlyRunningServer')} <b>{hostname}</b>
          </p>}
        </Card>
      </FormItem>
    </Form>;
  }
}

