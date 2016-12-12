import Immutable from 'immutable';

import { SET_SOURCE_AND_SCREENSHOT, QUIT_SESSION_REQUESTED, QUIT_SESSION_DONE, SELECT_ELEMENT_BY_XPATH,
  METHOD_CALL_REQUESTED, METHOD_CALL_DONE, SET_INPUT_VALUE, SET_EXPANDED_XPATHS } from '../actions/Inspector';

// Make sure there's always at least one cap
const INITIAL_STATE = {
  expandedXPaths: [],
};

export default function inspector (state=INITIAL_STATE, action) {
  switch (action.type) {
    case SET_SOURCE_AND_SCREENSHOT:
      return Immutable.fromJS(state)
        .set('source', action.source)
        .set('screenshot', action.screenshot)
        .toJS();

    case QUIT_SESSION_REQUESTED:
      return Immutable.fromJS(state)
        .set('isQuittingSession', true)
        .toJS();

    case QUIT_SESSION_DONE:
      return Immutable.fromJS(state)
        .delete('isQuittingSession')
        .toJS();
      
    case SELECT_ELEMENT_BY_XPATH:
      return Immutable.fromJS(state)
        .set('selectedXPath', action.xpath)
        .toJS();

    case METHOD_CALL_REQUESTED:
      return Immutable.fromJS(state)
        .set('methodCallRequested', true)
        .toJS();

    case METHOD_CALL_DONE:
      return Immutable.fromJS(state)
        .delete('methodCallRequested')
        .toJS();

    case SET_INPUT_VALUE:
      return Immutable.fromJS(state)
        .set(action.name, action.value)
        .toJS();

    case SET_EXPANDED_XPATHS:
      return Immutable.fromJS(state)
        .set('expandedXPaths', action.xpaths)
        .toJS();

    default:
      return {...state};
  }
}