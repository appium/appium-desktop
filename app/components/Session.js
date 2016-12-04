import React, { Component } from 'react';
import NewSessionForm from './Session/NewSessionForm';
import SavedSessions from './Session/SavedSessions';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

export default class Session extends Component {

  componentWillMount () {
    this.props.getSavedSessions();
  }

  render () {
    const { newSessionBegan, savedSessions, tabKey, switchTabs, changeServerType, serverType } = this.props;
    return (
      <div style={{width: '100%', padding: '1em'}}>{[
        (<Tabs activeKey={serverType} onChange={changeServerType}>
          <TabPane tab='Local Server' key='local'>Local</TabPane>
          <TabPane tab='Remote Server' key='remote'>Remote</TabPane>
          <TabPane tab='SauceLabs Server' key='sauce'>Sauce</TabPane>
        </Tabs>),

        (newSessionBegan ?  
        <div>
          <p>Session In Progress</p>
        </div> : 
        <Tabs activeKey={tabKey} onChange={(key) => switchTabs(key)}>
          <TabPane tab='Start New Session' key='new'>
            <NewSessionForm {...this.props} />
          </TabPane>
          <TabPane tab={`Saved Sessions (${savedSessions.length})`} key='saved'>
              <SavedSessions {...this.props} />
          </TabPane>
        </Tabs>),
      ]}
      </div>
    );
  }
}