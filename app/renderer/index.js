import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import electron from 'electron';
import WrongFolder from './components/WrongFolder/WrongFolder';
import routes from './routes';
import store from './store/store';

const { app } = electron.remote;
const isDev = process.env.NODE_ENV === 'development';
const history = syncHistoryWithStore(hashHistory, store);

function shouldShowWrongFolderComponent () {
  // If we set an ENV to show wrong folder
  if (process.env.WRONG_FOLDER) {
    return true;
  }

  // If we set an ENV to require it to NOT be shown don't show it
  if (process.env.FORCE_NO_WRONG_FOLDER) {
    return false;
  }

  return (app.isInApplicationsFolder && !app.isInApplicationsFolder()) && !isDev;
}

const router = <Router history={history}>
  {routes}
</Router>;

function renderApp () {
  render(
    <Provider store={store}>
      {shouldShowWrongFolderComponent() ?
        <WrongFolder /> :
        router
      }
    </Provider>,
    document.getElementById('root')
  );
}

renderApp();

if (module.hot) {
  module.hot.accept(renderApp);
}
