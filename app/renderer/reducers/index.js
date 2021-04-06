import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import startServer from './StartServer';
import serverMonitor from './ServerMonitor';
import updater from '../../../../shared/reducers/Updater';
import config from './Config';

// create our root reducer
export default function createRootReducer (history) {
  return combineReducers({
    router: connectRouter(history),
    startServer,
    serverMonitor,
    updater,
    config,
  });
}
