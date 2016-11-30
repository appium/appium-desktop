import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import startServer from './StartServer';
import serverMonitor from './ServerMonitor';
import session from './Session';

const rootReducer = combineReducers({
  routing,
  startServer,
  serverMonitor,
  session,
});

export default rootReducer;
