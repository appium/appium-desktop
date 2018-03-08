import { shell } from 'electron';
import React, { Component } from 'react';
import NewSessionForm from './NewSessionForm';
import SavedSessions from './SavedSessions';
import AttachToSession from './AttachToSession';
import ServerTypeTabs from './ServerTypeTabs';
import { Tabs, Button, Spin, Icon, Card } from 'antd';
import SessionStyles from './Session.css';

const {TabPane} = Tabs;

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
      requestSaveAsModal, newSession, caps, capsUUID, saveSession, isCapsDirty,
      sessionLoading, attachSessId} = this.props;

    let mode = "inspect";

    const isAttaching = tabKey === 'attach';

    return <Spin spinning={!!sessionLoading}>
      <div className={SessionStyles['session-container']}>
        <Tabs activeKey={mode} className={SessionStyles.topmostTabs}>
          <TabPane tab='Inspect & Record Tests' key="inspect">
          </TabPane>
          <TabPane tab='Run a Saved Test' key="playback">
            <div>Choose a previously-recorded test to run.</div>
          </TabPane>
          <TabPane tab='View Saved Tests' key="view">
          </TabPane>
        </Tabs>
        <Card className={SessionStyles.sessionCard}>
          <ServerTypeTabs {...this.props} />
        </Card>


        {newSessionBegan && <div key={2}>
          <p>Session In Progress</p>
        </div>}

        {!newSessionBegan && <Card className={`${SessionStyles.sessionCard} ${SessionStyles.sessionCardCaps}`}>
          <Tabs activeKey={tabKey} onChange={switchTabs} className={SessionStyles.scrollingTabCont}>
            <TabPane tab='Desired Capabilities' key='new' className={SessionStyles.scrollingTab}>
              <NewSessionForm {...this.props} />
            </TabPane>
            <TabPane tab={`Saved Capability Sets (${savedSessions.length})`} key='saved' className={SessionStyles.scrollingTab} disabled={savedSessions.length === 0}>
              <SavedSessions {...this.props} />
            </TabPane>
            <TabPane tab='Attach to Session...' key='attach' className={SessionStyles.scrollingTab}>
              <AttachToSession {...this.props} />
            </TabPane>
          </Tabs>
        </Card>}
        <div className={SessionStyles.sessionFooter}>
          <div style={{float: 'left'}}>
            <a href="#" onClick={(e) => e.preventDefault() || shell.openExternal("https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/caps.md")}>
              <Icon type='link' />&nbsp;
              Desired Capabilities Documentation
            </a>
          </div>
          { (!isAttaching && capsUUID) && <Button onClick={() => saveSession(caps, {uuid: capsUUID})} disabled={!isCapsDirty}>Save</Button> }
          {!isAttaching && <Button onClick={requestSaveAsModal}>Save As...</Button>}
          {!isAttaching && <Button type="primary" id='btnStartSession'
            onClick={() => newSession(caps)} className={SessionStyles['start-session-button']}>Start Session</Button>
          }
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
