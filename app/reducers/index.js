import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import startServer from './start-server';

const rootReducer = combineReducers({
  routing,
  startServer
});

export default rootReducer;
