import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import StartServerPage from './containers/StartServerPage';
import ServerMonitorPage from './containers/ServerMonitorPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={StartServerPage} />
    <Route path="monitor" component={ServerMonitorPage} />
  </Route>
);
