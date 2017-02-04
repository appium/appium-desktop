import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import startServer from './StartServer';
import serverMonitor from './ServerMonitor';
import session from './Session';
import inspector from './Inspector';

const rootReducer = combineReducers({
  routing,
  startServer,
  serverMonitor,
  session,
  inspector,
});

export default rootReducer;
