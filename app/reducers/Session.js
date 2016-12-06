import Immutable from 'immutable';

import { NEW_SESSION_REQUESTED, NEW_SESSION_BEGAN, NEW_SESSION_DONE,
        SAVE_SESSION_REQUESTED, SAVE_SESSION_DONE, GET_SAVED_SESSIONS_REQUESTED, GET_SAVED_SESSIONS_DONE,
        SET_CAPABILITY_PARAM, ADD_CAPABILITY, REMOVE_CAPABILITY, SET_CAPS,
        SWITCHED_TABS, SAVE_AS_MODAL_REQUESTED, HIDE_SAVE_AS_MODAL_REQUESTED, SET_SAVE_AS_TEXT,
        DELETE_SAVED_SESSION_REQUESTED, DELETE_SAVED_SESSION_DONE, 
        CHANGE_SERVER_TYPE, SET_SERVER_PARAM, SET_SERVER } from '../actions/Session';

// Make sure there's always at least one cap
const INITIAL_STATE = {
  savedSessions: [],
  tabKey: 'new',
  serverType: 'local',
  server: {
    local: {},
    remote: {},
    sauce: {},
  },
  caps: [{
    type: 'text',
  }],
  isCapsDirty: true,
  saveAsText: '',
};

export default function session (state=INITIAL_STATE, action) {
  switch (action.type) {
    case NEW_SESSION_REQUESTED:
      return Immutable.fromJS(state)
        .set('newSessionRequested', true)
        .toJS();

    case NEW_SESSION_BEGAN:
      return Immutable.fromJS(state)
        .set('newSessionBegan', true)
        .delete('newSessionRequested')
        .toJS();

    case NEW_SESSION_DONE:
      return Immutable.fromJS(state)
        .delete('newSessionBegan')
        .toJS();

    case ADD_CAPABILITY:
      return Immutable.fromJS(state)
        .updateIn(['caps'], (caps) => caps.push({type: 'text'}))
        .toJS();

    case REMOVE_CAPABILITY:
      return Immutable.fromJS(state)
        .deleteIn(['caps', action.index])
        .toJS();

    case SET_CAPABILITY_PARAM:
      return Immutable.fromJS(state)
        .setIn(['caps', action.index, action.name], action.value)
        .set('isCapsDirty', true)
        .toJS();

    case SET_CAPS:
      return Immutable.fromJS(state)
        .set('caps', action.caps)
        .set('capsUUID', action.uuid)
        .delete('isCapsDirty')
        .toJS();

    case SAVE_SESSION_REQUESTED:
      return Immutable.fromJS(state)
        .set('saveSessionRequested', true)
        .delete('showSaveAsModal')
        .toJS();

    case SAVE_SESSION_DONE:
      return Immutable.fromJS(state)
        .delete('saveSessionRequested')
        .toJS();

    case GET_SAVED_SESSIONS_REQUESTED:
      return Immutable.fromJS(state)
        .set('getSavedSessionsRequested', true)
        .toJS();

    case GET_SAVED_SESSIONS_DONE:
      return Immutable.fromJS(state)
        .delete('getSavedSessionsRequested')
        .set('savedSessions', action.savedSessions)
        .toJS();

    case DELETE_SAVED_SESSION_REQUESTED:
      return Immutable.fromJS(state)
        .set('deletingSession', true)
        .toJS();

    case DELETE_SAVED_SESSION_DONE:
      return Immutable.fromJS(state)
        .delete('deletingSession')
        .toJS();

    case SWITCHED_TABS:
      return Immutable.fromJS(state)
        .set('tabKey', action.key)
        .toJS();

    case SAVE_AS_MODAL_REQUESTED: 
      return Immutable.fromJS(state)
        .set('showSaveAsModal', true)
        .toJS();

    case HIDE_SAVE_AS_MODAL_REQUESTED: 
      return Immutable.fromJS(state)
        .set('saveAsText', '')
        .delete('showSaveAsModal')
        .toJS();

    case SET_SAVE_AS_TEXT:
      return Immutable.fromJS(state)
        .set('saveAsText', action.saveAsText)
        .toJS();

    case CHANGE_SERVER_TYPE:
      return Immutable.fromJS(state)
        .set('serverType', action.serverType)
        .toJS();

    case SET_SERVER_PARAM:
      return Immutable.fromJS(state)
        .setIn(['server', action.serverType, action.name], action.value)
        .toJS();

    case SET_SERVER:
      return Immutable.fromJS(state)
        .set('server', action.server || {})
        .set('serverType', action.serverType || 'local')
        .toJS();

    default:
      return {...state};
  }
}