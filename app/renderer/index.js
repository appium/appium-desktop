import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import electron from 'electron';
import WrongFolder from './components/WrongFolder/WrongFolder';
import routes from './routes';
import configureStore from './store/configureStore';
import './styles/app.global.css';
import './styles/github-gist-theme.global.css';

const {app} = electron.remote;
const isDev = process.env.NODE_ENV === 'development';
const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

function shouldShowWrongFolderComponent () {
  // If we set an ENV to require it to NOT be shown don't show it
  if (process.env.FORCE_NO_WRONG_FOLDER) {
    return false;
  }

  // Note: app.isInApplicationsFolder is undefined if it's not a Mac
  if (app.isInApplicationsFolder && !app.isInApplicationsFolder() && !isDev) {
    return true;
  } else if (isDev && process.env.WRONG_FOLDER) {
    return true;
  }
}

render(
  <Provider store={store}>
    {shouldShowWrongFolderComponent() ?
      <WrongFolder /> :
      <Router history={history} routes={routes} />
    }
  </Provider>,
  document.getElementById('root')
);

export { store };
