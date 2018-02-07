import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import StartServerPage from './containers/StartServerPage';
import ServerMonitorPage from './containers/ServerMonitorPage';
import SessionPage from './containers/SessionPage';
import InspectorPage from './containers/InspectorPage';
import PlaybackLibraryPage from './containers/PlaybackLibraryPage';
import UpdaterPage from './containers/UpdaterPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={StartServerPage} />
    <Route path="monitor" component={ServerMonitorPage} />
    <Route path="session" component={SessionPage} />
    <Route path="playback" component={PlaybackLibraryPage} />
    <Route path="inspector" component={InspectorPage} />
    <Route path="updater" component={UpdaterPage} />
  </Route>
);
