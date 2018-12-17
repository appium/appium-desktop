import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Routes from '../routes';
import WrongFolder from '../components/WrongFolder/WrongFolder';
import electron from 'electron';

const { app } = electron.remote;
const isDev = process.env.NODE_ENV === 'development';

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

export default class Root extends Component {
  render () {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        {shouldShowWrongFolderComponent() ?
          <WrongFolder /> :
          <ConnectedRouter history={history}>
            <Routes />
          </ConnectedRouter>
        }
      </Provider>
    );
  }
}
