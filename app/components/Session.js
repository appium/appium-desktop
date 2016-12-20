import React, { Component } from 'react';
import NewSessionForm from './Session/NewSessionForm';
import SavedSessions from './Session/SavedSessions';
import { Tabs, Form, Input, Button, Spin } from 'antd';
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

    return (<Spin spinning={!!sessionLoading}>
      <div className={SessionStyles['session-container']}>
        <Tabs activeKey={serverType} onChange={changeServerType}>
          <TabPane tab='Local Server' key={ServerTypes.local}>
            <Form>
              <FormItem>
                <Input placeholder='Hostname' value={server.local.hostname} onChange={(e) => setServerParam('hostname', e.target.value)} />
              </FormItem>
              <FormItem>
                <Input placeholder='Port' value={server.local.port} onChange={(e) => setServerParam('port', e.target.value)} />
              </FormItem>
            </Form>
          </TabPane>
          <TabPane tab='Remote Server' key={ServerTypes.remote}>
            <Form>
              <FormItem>
                <Input placeholder='Hostname' value={server.remote.hostname} onChange={(e) => setServerParam('hostname', e.target.value)} />
              </FormItem>
              <FormItem>
                <Input placeholder='Port' value={server.remote.port} onChange={(e) => setServerParam('port', e.target.value)} />
              </FormItem>
            </Form>
          </TabPane>
          <TabPane tab='Sauce Labs' key={ServerTypes.sauce}>
            <Form>
              <FormItem>
                <Input placeholder='Sauce Username' value={server.sauce.username} onChange={(e) => setServerParam('username', e.target.value)} />
              </FormItem>
              <FormItem>
                <Input type='password' placeholder='Sauce Access Key' value={server.sauce.accessKey} onChange={(e) => setServerParam('accessKey', e.target.value)} />
              </FormItem>
            </Form>
          </TabPane>
        </Tabs>


        {newSessionBegan && <div key={2}>
          <p>Session In Progress</p>
        </div>}
        
        {!newSessionBegan && <Tabs activeKey={tabKey} onChange={switchTabs}>
          <TabPane tab='Start New Session' key='new'>
            <NewSessionForm {...this.props} />
          </TabPane>
          <TabPane tab={`Saved Sessions (${savedSessions.length})`} key='saved'>
              <SavedSessions {...this.props} />
          </TabPane>
        </Tabs>}
        <div className={SessionStyles['pull-right']}>
          { capsUUID && <Button type="primary" onClick={() => saveSession(caps, {uuid: capsUUID})} disabled={!isCapsDirty}>Save</Button> }
          <Button type="button" onClick={requestSaveAsModal}>Save As</Button>
          <Button type="submit" onClick={() => newSession(caps)} className={SessionStyles['start-session-button']}>Start Session</Button>
        </div>
      </div>
    </Spin>);
  }
}