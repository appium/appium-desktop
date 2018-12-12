import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import StartServerPage from './containers/StartServerPage';
import ServerMonitorPage from './containers/ServerMonitorPage';
import SessionPage from './containers/SessionPage';
import InspectorPage from './containers/InspectorPage';
import ConfigPage from './containers/ConfigPage';

export default () => (
  <App>
    <Switch>
      <Route path="/" component={StartServerPage} />
      <Route path="/monitor" component={ServerMonitorPage} />
      <Route path="/session" component={SessionPage} />
      <Route path="/inspector" component={InspectorPage} />
      <Route path="/config" component={ConfigPage} />
    </Switch>
  </App>
);
