import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import StartServerPage from './containers/StartServerPage.js';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={StartServerPage} />
  </Route>
);
