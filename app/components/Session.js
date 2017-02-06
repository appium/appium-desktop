import React, { Component } from 'react';
import NewSessionForm from './Session/NewSessionForm';
import SavedSessions from './Session/SavedSessions';
import { Tabs, Form, Input, Button, Spin, Card } from 'antd';
import { ServerTypes } from '../actions/Session';
import SessionStyles from './Session.css';

const {TabPane} = Tabs;
const FormItem = Form.Item;

export default class Session extends Component {

  componentWillMount () {
    this.props.getSavedSessions();
    this.props.setSavedServerParams();
    this.props.setLocalServerParams();
  }

  render () {
    const {newSessionBegan, savedSessions, tabKey, switchTabs, changeServerType, serverType, setServerParam, server,
      requestSaveAsModal, newSession, caps, capsUUID, saveSession, isCapsDirty, sessionLoading} = this.props;

    return <Spin spinning={!!sessionLoading}>
      <div className={SessionStyles['session-container']}>
        <Tabs activeKey={serverType} onChange={changeServerType} className={SessionStyles.serverTabs}>
          <TabPane tab='Automatic Server' key={ServerTypes.local}>
            <Form>
              <FormItem>
                <Card>
                  <p className={SessionStyles.localDesc}>Will use currently-running Appium Desktop server at <b>http://{server.local.hostname}:{server.local.port}</b></p>
                </Card>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane tab='Custom Server' key={ServerTypes.remote}>
            <Form>
              <FormItem>
                <Input placeholder='127.0.0.1' addonBefore="Remote Host" value={server.remote.hostname} onChange={(e) => setServerParam('hostname', e.target.value)} size="large" />
              </FormItem>
              <FormItem>
                <Input placeholder='4723' addonBefore="Remote Port" value={server.remote.port} onChange={(e) => setServerParam('port', e.target.value)} size="large" />
              </FormItem>
            </Form>
          </TabPane>
          <TabPane tab='Sauce Labs' key={ServerTypes.sauce}>
            <Form>
              <FormItem>
                <Input placeholder='your-username' addonBefore="Sauce Username" value={server.sauce.username} onChange={(e) => setServerParam('username', e.target.value)} />
              </FormItem>
              <FormItem>
                <Input type='password' placeholder='your-access-key' addonBefore="Sauce Access Key" value={server.sauce.accessKey} onChange={(e) => setServerParam('accessKey', e.target.value)} />
              </FormItem>
            </Form>
          </TabPane>
        </Tabs>


        {newSessionBegan && <div key={2}>
          <p>Session In Progress</p>
        </div>}

        {!newSessionBegan && <Tabs activeKey={tabKey} onChange={switchTabs} className={SessionStyles.scrollingTabCont}>
          <TabPane tab='Desired Capabilities' key='new' className={SessionStyles.scrollingTab}>
            <NewSessionForm {...this.props} />
          </TabPane>
          <TabPane tab={`Saved Capability Sets (${savedSessions.length})`} key='saved' className={SessionStyles.scrollingTab}>
              <SavedSessions {...this.props} />
          </TabPane>
        </Tabs>}
        <div className={SessionStyles.sessionFooter}>
          { capsUUID && <Button onClick={() => saveSession(caps, {uuid: capsUUID})} disabled={!isCapsDirty}>Save</Button> }
          <Button onClick={requestSaveAsModal}>Save As...</Button>
          <Button type="primary" onClick={() => newSession(caps)} className={SessionStyles['start-session-button']}>Start Session</Button>
        </div>
      </div>
    </Spin>;
  }
}
