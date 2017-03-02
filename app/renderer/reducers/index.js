import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import startServer from './StartServer';
import serverMonitor from './ServerMonitor';
import session from './Session';
import inspector from './Inspector';
import updater from './Updater';
import settings from 'electron-settings';
import { PRESETS } from '../actions/StartServer';
import { SAVED_SESSIONS, SERVER_ARGS, SESSION_SERVER_PARAMS,
         SESSION_SERVER_TYPE } from '../actions/Session';

// set default persistent settings
// do it here because settings are kind of like state!
settings.defaults({
  [PRESETS]: {},
  [SAVED_SESSIONS]: [],
  [SERVER_ARGS]: null,
  [SESSION_SERVER_PARAMS]: null,
  [SESSION_SERVER_TYPE]: null,
});

// create our root reducer
const rootReducer = combineReducers({
  routing,
  startServer,
  serverMonitor,
  session,
  inspector,
  updater,
});

export default rootReducer;
