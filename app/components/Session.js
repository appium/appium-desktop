import React, { Component } from 'react';
import NewSessionForm from './Session/NewSessionForm';
import SavedSessions from './Session/SavedSessions';
import { Tabs, Form, Input } from 'antd';
import { ipcRenderer } from 'electron';
const { TabPane } = Tabs;
const FormItem = Form.Item;

export default class Session extends Component {

  componentWillMount () {
    this.props.getSavedSessions();
    this.props.setLocalServerParams();
  }

  render () {
    const { newSessionBegan, savedSessions, tabKey, switchTabs, changeServerType, serverType, setServerParam, server } = this.props;

    return (
      <div style={{width: '100%', padding: '1em'}}>
        <Tabs activeKey={serverType} onChange={changeServerType}>
          <TabPane tab='Local Server' key='local'>
            <Form>
              <FormItem>
                <Input placeholder='Hostname' value={server.local.hostname} onChange={(e) => setServerParam('hostname', e.target.value)} />
              </FormItem>
              <FormItem>
                <Input placeholder='Port' value={server.local.port} onChange={(e) => setServerParam('port', e.target.value)} />
              </FormItem>
            </Form>
          </TabPane>
          <TabPane tab='Remote Server' key='remote'>
            <Form>
              <FormItem>
                <Input placeholder='Hostname' value={server.remote.hostname} onChange={(e) => setServerParam('hostname', e.target.value)} />
              </FormItem>
              <FormItem>
                <Input placeholder='Port' value={server.remote.port} onChange={(e) => setServerParam('port', e.target.value)} />
              </FormItem>
            </Form>
          </TabPane>
          <TabPane tab='SauceLabs Server' key='sauce'>
            <Form>
              <FormItem>
                <Input placeholder='Sauce Username' value={server.sauce.username} onChange={(e) => setServerParam('username', e.target.value)} />
              </FormItem>
              <FormItem>
                <Input placeholder='Sauce Password' value={server.sauce.password} onChange={(e) => setServerParam('password', e.target.value)} />
              </FormItem>
            </Form>
          </TabPane>
        </Tabs>

        {newSessionBegan ?  
        <div key={2}>
          <p>Session In Progress</p>
        </div> : 
        <Tabs activeKey={tabKey} onChange={(key) => switchTabs(key)}>
          <TabPane tab='Start New Session' key='new'>
            <NewSessionForm {...this.props} />
          </TabPane>
          <TabPane tab={`Saved Sessions (${savedSessions.length})`} key='saved'>
              <SavedSessions {...this.props} />
          </TabPane>
        </Tabs>}
      </div>
    );
  }
}