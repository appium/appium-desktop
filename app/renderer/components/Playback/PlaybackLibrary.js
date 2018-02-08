import React, { Component } from 'react';
import { Spin, Tabs } from 'antd';
import ServerTypeTabs from '../Session/ServerTypeTabs';
import SavedTests from './SavedTests';
import TestResults from './TestResults';
import SessionStyles from '../Session/Session.css';

const {TabPane} = Tabs;

export default class PlaybackLibrary extends Component {

  componentWillMount () {
    const {setLocalServerParams, setSavedServerParams} = this.props;
    (async function () {
      await setSavedServerParams();
      await setLocalServerParams();
    })();
  }

  render () {
    const {playbackLoading, sessionState, serverType, changeServerType,
      playbackSessionBegan, tabKey, switchTabs, savedTests, testResults
    } = this.props;
    const {server} = sessionState;
    const props = {server, serverType, changeServerType};
    return <Spin spinning={!!playbackLoading}>
      <div className={SessionStyles['session-container']}>
        {tabKey === 'tests' && <ServerTypeTabs {...props} />}

        {playbackSessionBegan && <div key={2}>
          <p>Test In Progress</p>
        </div>}

        {!playbackSessionBegan && <Tabs activeKey={tabKey} onChange={switchTabs} className={`${SessionStyles.scrollingTabCont} ${SessionStyles.serverTabs}`}>
          <TabPane tab={`Test Library (${savedTests.length})`} key='tests' className={SessionStyles.scrollingTab}>
            <SavedTests tests={savedTests} />
          </TabPane>
          <TabPane tab="Test Results" key='results' className={SessionStyles.scrollingTab}>
            <TestResults testResults={testResults} />
          </TabPane>
        </Tabs>}
      </div>
    </Spin>;
  }
}
