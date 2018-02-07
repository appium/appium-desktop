import React, { Component } from 'react';
import { Form, Card } from 'antd';
import SessionStyles from './Session.css';

const FormItem = Form.Item;

export default class ServerTabSauce extends Component {

  render () {

    const {server} = this.props;

    return <Form>
      <FormItem>
        <Card>
          {server.local.port && <p className={SessionStyles.localDesc}>Will use currently-running Appium Desktop server at
            <b> http://{server.local.hostname === "0.0.0.0" ? "localhost" : server.local.hostname}:{server.local.port}</b>
          </p>}
        </Card>
      </FormItem>
    </Form>;
  }
}

