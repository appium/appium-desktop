import Immutable from 'immutable';

import { SET_SOURCE } from '../actions/Inspector';

// Make sure there's always at least one cap
const INITIAL_STATE = {
};

export default function inspector (state=INITIAL_STATE, action) {
  switch (action.type) {
    case SET_SOURCE:
      return Immutable.fromJS(state)
        .set('source', action.source)
        .toJS();
    default:
      return {...state};
  }
}