import { shell } from 'electron';
import React, { Component } from 'react';
import NewSessionForm from './NewSessionForm';
import SavedSessions from './SavedSessions';
import AttachToSession from './AttachToSession';
import ServerTypeTabs from './ServerTypeTabs';
import SessionModeTabs from './SessionModeTabs';
import SavedTests from './SavedTests';
import TestRun from './TestRun';
import TestResults from './TestResults';
import { Tabs, Button, Spin, Icon, Card } from 'antd';
import SessionStyles from './Session.css';
import { SessionModes } from '../../actions/Session';

const {TabPane} = Tabs;

export default class Session extends Component {

  componentWillMount () {
    const {
      setLocalServerParams, getSavedSessions, setSavedServerParams,
      getRunningSessions, getSavedTests, getTestResults,
    } = this.props;
    (async function () {
      await getSavedSessions();
      await setSavedServerParams();
      await setLocalServerParams();
      await getSavedTests();
      await getTestResults();
      getRunningSessions();
    })();
  }

  render () {
    const {newSessionBegan, savedSessions, tabKey, switchTabs,
      requestSaveAsModal, newSession, caps, capsUUID, saveSession, isCapsDirty,
      sessionLoading, attachSessId, mode, requestTestRun, testToRun} = this.props;

    const isAttaching = tabKey === 'attach';
    const isInspecting = mode === SessionModes.inspect;
    const isPlayback = mode === SessionModes.playback;
    const isViewing = mode === SessionModes.view;
    const showCapsTab = !newSessionBegan && !isViewing;

    return <Spin spinning={!!sessionLoading}>
      <div className={SessionStyles['session-container']}>
        <SessionModeTabs {...this.props} />

        {isPlayback && <Card className={`${SessionStyles.sessionCard} ${SessionStyles.sessionCardTests}`}>
          <SavedTests {...this.props} />
        </Card>}

        {isViewing && <Card className={`${SessionStyles.sessionCard} ${SessionStyles.sessionCardResults}`}>
          <TestResults {...this.props} />
        </Card>}

        {showCapsTab && <Card className={SessionStyles.sessionCard}>
          <ServerTypeTabs {...this.props} />
        </Card>}

        {newSessionBegan && <div key={2}>
          <p>Session In Progress</p>
        </div>}

        {showCapsTab && <Card className={`${SessionStyles.sessionCard} ${SessionStyles.sessionCardCaps}`}>
          <Tabs activeKey={tabKey} onChange={switchTabs} className={SessionStyles.scrollingTabs}>
            <TabPane tab='Desired Capabilities' key='new'>
              <NewSessionForm {...this.props} />
            </TabPane>
            <TabPane tab={`Saved Capability Sets (${savedSessions.length})`} key='saved' disabled={savedSessions.length === 0}>
              <SavedSessions {...this.props} />
            </TabPane>
            <TabPane tab='Attach to Session...' key='attach'>
              <AttachToSession {...this.props} />
            </TabPane>
          </Tabs>
        </Card>}

        {showCapsTab &&
        <div className={SessionStyles.sessionFooter}>
          <div style={{float: 'left'}}>
            <a href="#" onClick={(e) => e.preventDefault() || shell.openExternal("https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/caps.md")}>
              <Icon type='link' />&nbsp;
              Desired Capabilities Documentation
            </a>
          </div>
          { (!isAttaching && capsUUID) && <Button onClick={() => saveSession(caps, {uuid: capsUUID})} disabled={!isCapsDirty}>Save Capabilities</Button> }
          {!isAttaching && <Button onClick={requestSaveAsModal}>Save Capabilities As...</Button>}
          {isInspecting && !isAttaching && <Button type="primary" id='btnStartSession'
            onClick={() => newSession(caps)} className={SessionStyles['start-session-button']}>Start Session</Button>
          }
          {isInspecting && isAttaching &&
            <Button type="primary" disabled={!attachSessId} onClick={() => newSession(null, attachSessId)}>
              Attach to Session
            </Button>
          }
          {isPlayback &&
            <Button type="primary" disabled={!testToRun} onClick={requestTestRun}
              className={SessionStyles['start-session-button']}
            >
                Run Test
            </Button>
          }
        </div>}

        <TestRun {...this.props} />

      </div>
    </Spin>;
  }
}
