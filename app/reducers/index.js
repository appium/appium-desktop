import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import startServer from './StartServer';
import serverMonitor from './ServerMonitor';

const rootReducer = combineReducers({
  routing,
  startServer,
  serverMonitor
});

export default rootReducer;
