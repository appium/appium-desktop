import {omit} from 'lodash';

import { NEW_SESSION_REQUESTED, NEW_SESSION_BEGAN, NEW_SESSION_DONE,
        SAVE_SESSION_REQUESTED, SAVE_SESSION_DONE, GET_SAVED_SESSIONS_REQUESTED, GET_SAVED_SESSIONS_DONE,
        SESSION_LOADING, SESSION_LOADING_DONE,
        SET_CAPABILITY_PARAM, ADD_CAPABILITY, REMOVE_CAPABILITY, SET_CAPS,
        SWITCHED_TABS, SAVE_AS_MODAL_REQUESTED, HIDE_SAVE_AS_MODAL_REQUESTED, SET_SAVE_AS_TEXT,
        DELETE_SAVED_SESSION_REQUESTED, DELETE_SAVED_SESSION_DONE,
        CHANGE_SERVER_TYPE, SET_SERVER_PARAM, SET_SERVER,
        ServerTypes } from '../actions/Session';

// Make sure there's always at least one cap
const INITIAL_STATE = {
  savedSessions: [],
  tabKey: 'new',
  serverType: ServerTypes.local,
  server: {
    local: {},
    remote: {},
    sauce: {},
  },

  // Make sure there's always at least one cap
  caps: [{
    type: 'text',
  }],

  isCapsDirty: true,
};

let nextState;

export default function session (state = INITIAL_STATE, action) {
  switch (action.type) {
    case NEW_SESSION_REQUESTED:
      return {
        ...state,
        newSessionRequested: true,
      };

    case NEW_SESSION_BEGAN:
      nextState = {
        ...state,
        newSessionBegan: true,
      };
      return omit(nextState, 'newSessionRequested');

    case NEW_SESSION_DONE:
      return omit(state, 'newSessionBegan');


    case ADD_CAPABILITY:
      return {
        ...state,
        caps: [
          ...state.caps,
          {type: 'text'},
        ],
      };

    case REMOVE_CAPABILITY:
      return {
        ...state,
        caps: state.caps.filter((cap, index) => index !== action.index),
      };

    case SET_CAPABILITY_PARAM:
      return {
        ...state,
        isCapsDirty: true,
        caps: state.caps.map((cap, index) => index !== action.index ? cap : {
          ...cap,
          [action.name]: action.value
        }),
      };

    case SET_CAPS:
      nextState = {
        ...state,
        caps: action.caps,
        capsUUID: action.uuid,
      };
      return omit(nextState, 'isCapsDirty');

    case SAVE_SESSION_REQUESTED:
      nextState = {
        ...state,
        saveSessionRequested: true,
      };
      return omit(nextState, 'showSaveAsModal');

    case SAVE_SESSION_DONE:
      return omit(state, ['saveSessionRequested', 'saveAsText']);

    case GET_SAVED_SESSIONS_REQUESTED:
      return {
        ...state,
        getSavedSessionsRequested: true,
      };

    case GET_SAVED_SESSIONS_DONE:
      nextState = {
        ...state,
        savedSessions: action.savedSessions
      };
      return omit(nextState, 'getSavedSessionsRequested');

    case DELETE_SAVED_SESSION_REQUESTED:
      return {
        ...state,
        deletingSession: true,
      };

    case DELETE_SAVED_SESSION_DONE:
      return {
        ...state,
        deletingSession: false,
        capsUUID: null
      };

    case SWITCHED_TABS:
      return {
        ...state,
        tabKey: action.key,
      };

    case SAVE_AS_MODAL_REQUESTED:
      return {
        ...state,
        'showSaveAsModal': true,
      };

    case HIDE_SAVE_AS_MODAL_REQUESTED:
      return omit(state, ['saveAsText', 'showSaveAsModal']);

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
      return {
        ...state,
        server: {
          ...state.server,
          [action.serverType]: {
            ...state.server[action.serverType],
            [action.name]: action.value,
          }
        },
      };

    case SET_SERVER:
      return {
        ...state,

        // Only set remote and sauce; 'local' comes from electron-settings
        server: {
          ...state.server,
          remote: action.server.remote || {},
          sauce: action.server.sauce || {},
        },
        serverType: action.serverType || ServerTypes.local,
      };

    case SESSION_LOADING:
      return {
        ...state,
        sessionLoading: true,
      };

    case SESSION_LOADING_DONE:
      return omit(state, 'sessionLoading');

    default:
      return {...state};
  }
}
