import React, { Component } from 'react';
import { Spin } from 'antd';
import ServerTypeTabs from '../Session/ServerTypeTabs';
import SessionStyles from '../Session/Session.css';

export default class PlaybackLibrary extends Component {

  componentWillMount () {
    const {setLocalServerParams, setSavedServerParams} = this.props;
    (async function () {
      await setSavedServerParams();
      await setLocalServerParams();
    })();
  }

  render () {
    const {playbackLoading, sessionState, serverType,
      changeServerType} = this.props;
    const {server} = sessionState;
    const props = {server, serverType, changeServerType};
    return <Spin spinning={!!playbackLoading}>
      <div className={SessionStyles['session-container']}>
        <ServerTypeTabs {...props} />
      </div>
    </Spin>;
  }
}
