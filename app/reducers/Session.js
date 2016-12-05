import Immutable from 'immutable';

import { NEW_SESSION_REQUESTED, NEW_SESSION_BEGAN, NEW_SESSION_DONE,
        SAVE_SESSION_REQUESTED, SAVE_SESSION_DONE, GET_SAVED_SESSIONS_REQUESTED, GET_SAVED_SESSIONS_DONE,
        SET_CAPABILITY_PARAM, ADD_CAPABILITY, REMOVE_CAPABILITY, SET_CAPS,
        SWITCHED_TABS, SAVE_AS_MODAL_REQUESTED, HIDE_SAVE_AS_MODAL_REQUESTED, SET_SAVE_AS_TEXT,
        DELETE_SAVED_SESSION_REQUESTED, CHANGE_SERVER_TYPE, SET_SERVER_PARAM } from '../actions/Session';

let caps;

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
};

export default function session (state=INITIAL_STATE, action) {
  switch (action.type) {
    case NEW_SESSION_REQUESTED:
      return {
        ...state,
        newSessionRequested: true
      };

    case NEW_SESSION_BEGAN:
      return {
        ...state,
        newSessionRequested: false,
        newSessionBegan: true
      };

    case NEW_SESSION_DONE:
      return {
        ...state,
        newSessionBegan: false,
      };

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
        .toJS();

    case SET_CAPS:
      return {
        ...state,
        caps: action.caps
      };

    case SAVE_SESSION_REQUESTED:
      return {
        ...state,
        saveSessionRequested: true,
        showSaveAsModal: false,
      };

    case SAVE_SESSION_DONE:
      return {
        ...state,
        saveSessionRequested: false,
      };

    case GET_SAVED_SESSIONS_REQUESTED:
      return {
        ...state,
        getSavedSessionsRequested: true
      };

    case GET_SAVED_SESSIONS_DONE:
      return {
        ...state,
        getSavedSessionsRequested: false,
        savedSessions: action.savedSessions
      };

    case DELETE_SAVED_SESSION_REQUESTED:
      return {
        ...state,
        deletingSession: true,
      };

    case SWITCHED_TABS:
      return {
        ...state,
        tabKey: action.key,
      };

    case SAVE_AS_MODAL_REQUESTED: 
      return {
        ...state,
        showSaveAsModal: true,
      };

    case HIDE_SAVE_AS_MODAL_REQUESTED: 
      return {
        ...state,
        saveAsText: '',
        showSaveAsModal: false,
      };

    case SET_SAVE_AS_TEXT:
      return {
        ...state,
        saveAsText: action.saveAsText,
      };
    case CHANGE_SERVER_TYPE:
      return {
        ...state,
        serverType: action.serverType,
      };

    case SET_SERVER_PARAM:
      return Immutable.fromJS(state)
        .setIn(['server', state.serverType, action.name], action.value)
        .toJS();

    default:
      return {...state};
  }
}