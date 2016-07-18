import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import startServer from './start-server';
import serverMonitor from './server-monitor';

const rootReducer = combineReducers({
  routing,
  startServer,
  serverMonitor
});

export default rootReducer;
