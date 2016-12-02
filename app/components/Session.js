import React, { Component } from 'react';
import styles from './Session.css';
import NewSessionForm from './Session/NewSessionForm';
import RecentSessions from './Session/RecentSessions';
import SavedSessions from './Session/SavedSessions';
import { Tabs, Row, Col } from 'antd';
const { TabPane } = Tabs;

export default class Session extends Component {

  render () {
    const { newSessionBegan } = this.props;
    return (
      <div>
        {
          newSessionBegan ?  
          <div>
            <p>Session In Progress</p>
          </div> : 
          <Tabs defaultActiveKey="1">
            <TabPane tab='Start New Session' key='1'>
              <NewSessionForm {...this.props} />
            </TabPane>
            <TabPane tab='Recent Sessions' key='2'>
                <RecentSessions {...this.props} />
            </TabPane>
            <TabPane tab='Saved Sessions' key='3'>
                <SavedSessions {...this.props} />
            </TabPane>
          </Tabs>
        }
        
      </div>
    );
  }
}