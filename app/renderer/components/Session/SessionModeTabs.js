import React, { Component } from 'react';
import SessionStyles from './Session.css';
import { SessionModes } from '../../actions/Session';
import { Tabs } from 'antd';

const {TabPane} = Tabs;

export default class SessionModeTabs extends Component {

  render () {
    const {mode, changeSessionMode, savedTests, testResults} = this.props;

    return <div id='sessionModeTabs'>
      <Tabs activeKey={mode} onChange={changeSessionMode} className={SessionStyles.topmostTabs}>
        <TabPane tab='Inspect & Record Tests' key={SessionModes.inspect} />
        <TabPane tab={`Run a Saved Test (${savedTests.length})`} key={SessionModes.playback} />
        <TabPane tab={`View Test Results (${testResults.length})`} key={SessionModes.view} />
      </Tabs>
    </div>;
  }
}
