import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import electron from 'electron';
import routes from './routes';
import configureStore from './store/configureStore';
import './styles/app.global.css';
import './styles/github-gist-theme.global.css';

const {app} = electron.remote;
const isDev = process.env.NODE_ENV === 'development';
const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

render(
  <Provider store={store}>
    {(app.isInApplicationsFolder() || (isDev && !process.env.WRONG_FOLDER)) ?
      <Router history={history} routes={routes} /> :
      <div>Not in applications folder</div>
    }
  </Provider>,
  document.getElementById('root')
);
