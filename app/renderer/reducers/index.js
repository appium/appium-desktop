import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import startServer from './StartServer';
import serverMonitor from './ServerMonitor';
import session from './Session';
import inspector from './Inspector';
import updater from './Updater';

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
