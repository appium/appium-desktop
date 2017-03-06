import React, { Component } from 'react';
import { Form, Input, Card } from 'antd';
import SessionCSS from './Session.css';

const FormItem = Form.Item;

export default class AttachToSession extends Component {

  render () {
    let {attachSessId, setAttachSessId} = this.props;
    return (<Form>
      <FormItem>
        <Card>
          <p className={SessionCSS.localDesc}>If you have an already-running session of the above server type, you can attach an inspector to it directly.<br/>Simply enter the session ID in the box below.</p>
        </Card>
      </FormItem>
      <FormItem>
        <Input placeholder='1234-5789-1234-57890' addonBefore="Session ID" value={attachSessId} onChange={(e) => setAttachSessId(e.target.value)} size="large" />
      </FormItem>
    </Form>);
  }
}
