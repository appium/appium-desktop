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
    const { newSessionBegan, savedSessions, tabKey, switchTabs } = this.props;
    return (
      <div style={{width: '100%', padding: '1em'}}>
        {
          newSessionBegan ?  
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
          </Tabs>
        }
        
      </div>
    );
  }
}