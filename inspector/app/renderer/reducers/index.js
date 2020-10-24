import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import session from './Session';
import inspector from './Inspector';
import updater from '../../../../shared/reducers/Updater';

// create our root reducer
export default function createRootReducer (history) {
  return combineReducers({
    router: connectRouter(history),
    session,
    inspector,
    updater,
  });
}
