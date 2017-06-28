import { shell } from 'electron';
import React, { Component } from 'react';
import NewSessionForm from './NewSessionForm';
import SavedSessions from './SavedSessions';
import AttachToSession from './AttachToSession';
import { Tabs, Form, Input, Button, Spin, Card, Icon } from 'antd';
import { ServerTypes } from '../../actions/Session';
import SessionStyles from './Session.css';

const {TabPane} = Tabs;
const FormItem = Form.Item;

export default class Session extends Component {

  componentWillMount () {
    const {setLocalServerParams, getSavedSessions, setSavedServerParams, getRunningSessions} = this.props;
    (async function () {
      await getSavedSessions();
      await setSavedServerParams();
      await setLocalServerParams();
      getRunningSessions();
    })();
  }

  render () {
    const {newSessionBegan, savedSessions, tabKey, switchTabs,
      changeServerType, serverType, setServerParam, server,
      requestSaveAsModal, newSession, caps, capsUUID, saveSession, isCapsDirty,
      sessionLoading, attachSessId} = this.props;

    const isAttaching = tabKey === 'attach';

    const sauceTabHead = <span className={SessionStyles.tabText}><img src="images/sauce_logo.svg" /></span>;
    const testObjectTabHead = <span className={SessionStyles.tabText}><img src="images/testobject_logo.svg" /></span>;

    return <Spin spinning={!!sessionLoading}>
      <div className={SessionStyles['session-container']}>
        <div id='serverTypeTabs'>
          <Tabs activeKey={serverType} onChange={changeServerType} className={SessionStyles.serverTabs}>
            <TabPane disabled={!server.local.port} tab='Automatic Server' key={ServerTypes.local}>
              <Form>
                <FormItem>
                  <Card>
                    {server.local.port && <p className={SessionStyles.localDesc}>Will use currently-running Appium Desktop server at
                      <b> http://{server.local.hostname === "0.0.0.0" ? "localhost" : server.local.hostname}:{server.local.port}</b>
                    </p>}
                  </Card>
                </FormItem>
              </Form>
            </TabPane>
            <TabPane tab='Custom Server' key={ServerTypes.remote}>
              <Form>
                <FormItem>
                  <Input id='customServerHost' placeholder='127.0.0.1' addonBefore="Remote Host" value={server.remote.hostname} onChange={(e) => setServerParam('hostname', e.target.value)} size="large" />
                </FormItem>
                <FormItem>
                  <Input id='customServerPort' placeholder='4723' addonBefore="Remote Port" value={server.remote.port} onChange={(e) => setServerParam('port', e.target.value)} size="large" />
                </FormItem>
              </Form>
            </TabPane>
            <TabPane tab={sauceTabHead} key={ServerTypes.sauce}>
              <Form>
                <FormItem>
                  <Input id='sauceUsername' placeholder={process.env.SAUCE_USERNAME ? 'Using data found in $SAUCE_USERNAME' : 'your-username'} addonBefore="Sauce Username" value={server.sauce.username} onChange={(e) => setServerParam('username', e.target.value)} />
                </FormItem>
                <FormItem>
                  <Input id='saucePassword' type='password' placeholder={process.env.SAUCE_ACCESS_KEY ? 'Using data found in $SAUCE_ACCESS_KEY' : 'your-access-key'} addonBefore="Sauce Access Key" value={server.sauce.accessKey} onChange={(e) => setServerParam('accessKey', e.target.value)} />
                </FormItem>
              </Form>
            </TabPane>
            <TabPane tab={testObjectTabHead} key={ServerTypes.testobject}>
              <Form>
                <FormItem>
                  <Input id='testObjectPassword' type='password' placeholder={process.env.TESTOBJECT_API_KEY ? 'Using data found in $TESTOBJECT_API_KEY' : 'testobject-api-key'} addonBefore="TestObject API Key" value={server.testobject.apiKey} onChange={(e) => setServerParam('apiKey', e.target.value)} />
                </FormItem>
              </Form>
            </TabPane>
          </Tabs>
        </div>


        {newSessionBegan && <div key={2}>
          <p>Session In Progress</p>
        </div>}

        {!newSessionBegan && <Tabs activeKey={tabKey} onChange={switchTabs} className={SessionStyles.scrollingTabCont}>
          <TabPane tab='Desired Capabilities' key='new' className={SessionStyles.scrollingTab}>
            <NewSessionForm {...this.props} />
          </TabPane>
          <TabPane tab={`Saved Capability Sets (${savedSessions.length})`} key='saved' className={SessionStyles.scrollingTab} disabled={savedSessions.length === 0}>
            <SavedSessions {...this.props} />
          </TabPane>
          <TabPane tab='Attach to Session...' key='attach' className={SessionStyles.scrollingTab}>
            <AttachToSession {...this.props} />
          </TabPane>
        </Tabs>}
        <div className={SessionStyles.sessionFooter}>
          <div style={{float: 'left'}}>
            <a href="#" onClick={(e) => e.preventDefault() || shell.openExternal("https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/caps.md")}>
              <Icon type='link' />&nbsp;
              Desired Capabilities Documentation
            </a>
          </div>
          { (!isAttaching && capsUUID) && <Button onClick={() => saveSession(caps, {uuid: capsUUID})} disabled={!isCapsDirty}>Save</Button> }
          {!isAttaching && <Button onClick={requestSaveAsModal}>Save As...</Button>}
          {!isAttaching && <Button type="primary" onClick={() => newSession(caps)} className={SessionStyles['start-session-button']}>Start Session</Button>}
          {isAttaching &&
            <Button type="primary" disabled={!attachSessId} onClick={() => newSession(null, attachSessId)}>
              Attach to Session
            </Button>
          }
        </div>
      </div>
    </Spin>;
  }
}
