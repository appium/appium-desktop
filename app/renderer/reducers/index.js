import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import startServer from './StartServer';
import serverMonitor from './ServerMonitor';
import session from './Session';
import inspector from './Inspector';
import updater from './Updater';
import config from './Config';

// create our root reducer
export default function createRootReducer (history) {
  return combineReducers({
    router: connectRouter(history),
    startServer,
    serverMonitor,
    session,
    inspector,
    updater,
    config,
  });
}
