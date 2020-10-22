import React, { Component } from 'react';
import { Form, Card, Select, Button, Row, Col } from 'antd';
import SessionCSS from './Session.css';
import {
  ReloadOutlined
} from '@ant-design/icons';

const FormItem = Form.Item;

function formatCaps (caps) {
  let importantCaps = [caps.app, caps.platformName, caps.deviceName];
  if (caps.automationName) {
    importantCaps.push(caps.automationName);
  }
  return importantCaps.join(', ').trim();
}

export default class AttachToSession extends Component {

  getSessionInfo (session) {
    return `${session.id} — ${formatCaps(session.capabilities)}`;
  }

  render () {
    let {attachSessId, setAttachSessId, runningAppiumSessions, getRunningSessions, t} = this.props;
    attachSessId = attachSessId || '';
    return (<Form>
      <FormItem>
        <Card>
          <p className={SessionCSS.localDesc}>{t('connectToExistingSessionInstructions')}<br/>{t('selectSessionIDInDropdown')}</p>
        </Card>
      </FormItem>
      <FormItem>
        <Row>
          <Col span={23}>
            <Select showSearch
              mode='AutoComplete'
              notFoundContent='None found'
              placeholder={t('enterYourSessionId')}
              value={attachSessId}
              onChange={(value) => setAttachSessId(value)}>
              {runningAppiumSessions.map((session) => <Select.Option key={session.id} value={session.id}>
                <div>{this.getSessionInfo(session)}</div>
              </Select.Option>)}
            </Select>
          </Col>
          <Col span={1}>
            <div className={SessionCSS.btnReload}>
              <Button
                onClick={getRunningSessions}
                icon={<ReloadOutlined/>} />
            </div>
          </Col>
        </Row>
      </FormItem>
    </Form>);
  }
}
