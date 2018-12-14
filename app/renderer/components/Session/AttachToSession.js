import React, { Component } from 'react';
import { Form, Card, Select, Button, Row, Col } from 'antd';
import SessionCSS from './Session.css';

const FormItem = Form.Item;

function formatCaps (caps) {
  let importantCaps = [caps.app, caps.platformName, caps.deviceName];
  if (caps.automationName) {
    importantCaps.push(caps.automationName);
  }
  return importantCaps.join(', ').trim();
}

export default class AttachToSession extends Component {

  render () {
    let {attachSessId, setAttachSessId, runningAppiumSessions, getRunningSessions} = this.props;
    attachSessId = attachSessId || "";
    return (<Form>
      <FormItem>
        <Card>
          <p className={SessionCSS.localDesc}>If you have an already-running session of the above server type, you can attach an inspector to it directly.<br/>Select the Session ID in the dropdown below.</p>
        </Card>
      </FormItem>
      <FormItem>
        <Row>
          <Col span={23}>
            <Select showSearch
              mode='combobox'
              notFoundContent='None found'
              placeholder='Enter your session ID here'
              value={attachSessId}
              onChange={(value) => setAttachSessId(value)}>
              {runningAppiumSessions.map((session) => <Select.Option key={session.id} value={session.id}>
                <div>{session.id} -- {formatCaps(session.capabilities)}</div>
              </Select.Option>)}
            </Select>
          </Col>
          <Col span={1}>
            <div style={{"float": "right"}}>
              <Button onClick={getRunningSessions} icon='reload' />
            </div>
          </Col>
        </Row>
      </FormItem>
    </Form>);
  }
}
