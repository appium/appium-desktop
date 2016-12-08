import Immutable from 'immutable';

import { SET_SOURCE_AND_SCREENSHOT } from '../actions/Inspector';

// Make sure there's always at least one cap
const INITIAL_STATE = {
};

export default function inspector (state=INITIAL_STATE, action) {
  switch (action.type) {
    case SET_SOURCE_AND_SCREENSHOT:
      return Immutable.fromJS(state)
        .set('source', action.source)
        .set('screenshot', action.screenshot)
        .toJS();
    default:
      return {...state};
  }
}