import {omit, toPairs} from 'lodash';
import formatJSON from 'format-json';

import { NEW_SESSION_REQUESTED, NEW_SESSION_BEGAN, NEW_SESSION_DONE,
        SAVE_SESSION_REQUESTED, SAVE_SESSION_DONE, GET_SAVED_SESSIONS_REQUESTED,
        GET_SAVED_SESSIONS_DONE, SESSION_LOADING, SESSION_LOADING_DONE,
        SET_CAPABILITY_PARAM, ADD_CAPABILITY, REMOVE_CAPABILITY, SET_CAPS,
        SWITCHED_TABS, SAVE_AS_MODAL_REQUESTED, HIDE_SAVE_AS_MODAL_REQUESTED, SET_SAVE_AS_TEXT,
        DELETE_SAVED_SESSION_REQUESTED, DELETE_SAVED_SESSION_DONE,
        CHANGE_SERVER_TYPE, SET_SERVER_PARAM, SET_SERVER, SET_ATTACH_SESS_ID,
        GET_SESSIONS_REQUESTED, GET_SESSIONS_DONE,
        ENABLE_DESIRED_CAPS_EDITOR, ABORT_DESIRED_CAPS_EDITOR, SAVE_RAW_DESIRED_CAPS, SET_RAW_DESIRED_CAPS,
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
    testobject: {
      dataCenter: 'US',
    },
  },
  attachSessId: null,

  // Make sure there's always at least one cap
  caps: [{
    type: 'text',
  }],

  isCapsDirty: true,
  gettingSessions: false,
  runningAppiumSessions: [],
  isEditingDesiredCaps: false,
  isValidCapsJson: true,
  isValidatingCapsJson: false,
};

let nextState;

function getCapType (value) {
  let type = typeof(value);
  if (type === 'string') {
    type = 'text';
  }
  return type;
}

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
        savedSessions: action.savedSessions || [],
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
        // Only set remote, sauce, and testobject; 'local' comes from electron-settings
        server: {
          ...state.server,
          remote: action.server.remote || {},
          sauce: action.server.sauce || {},
          testobject: action.server.testobject || {},
        },
        serverType: action.serverType || ServerTypes.local,
      };

    case SET_ATTACH_SESS_ID:
      return {
        ...state,
        attachSessId: action.attachSessId
      };

    case SESSION_LOADING:
      return {
        ...state,
        sessionLoading: true,
      };

    case SESSION_LOADING_DONE:
      return omit(state, 'sessionLoading');

    case GET_SESSIONS_REQUESTED:
      return {
        ...state,
        gettingSessions: true,
      };

    case GET_SESSIONS_DONE:
      return {
        ...state,
        gettingSessions: false,
        attachSessId: (action.sessions && action.sessions.length > 0 && !state.attachSessId) ? action.sessions[0].id : state.attachSessId,
        runningAppiumSessions: action.sessions || [],
      };

    case ENABLE_DESIRED_CAPS_EDITOR:
      const {caps} = state;
      let rawCaps = {};
      for (let {name, value} of caps) {
        rawCaps[name] = value;
      }

      return {
        ...state,
        isEditingDesiredCaps: true,
        rawDesiredCaps: formatJSON.plain(rawCaps),
        isValidCapsJson: true,
        isValidatingCapsJson: false, // Don't start validating JSON until the user has attempted to save the JSON
      };

    case ABORT_DESIRED_CAPS_EDITOR:
      return {
        ...state,
        isEditingDesiredCaps: false,
        rawDesiredCaps: undefined,
      };

    case SAVE_RAW_DESIRED_CAPS:
      const {rawDesiredCaps} = state;
      try {
        const newCaps = JSON.parse(rawDesiredCaps);

        // Transform the current caps array to an object
        let {caps:capsArray} = state;
        let caps = {};
        for (let {type, name, value} of capsArray) {
          caps[name] = {type, value};
        }

        // Translate the caps JSON to array format
        let newCapsArray = toPairs(newCaps).map(([name, value]) => ({
          type: (caps[name] && caps[name].type === 'file' && typeof(value) === 'string') ? 'file' : getCapType(value),  // If we already have that cap and it's file type, keep the type the same
          name,
          value,
        }));

        return {
          ...state,
          isEditingDesiredCaps: false,
          caps: newCapsArray,
        };
      } catch (e) {
        return {
          ...state,
          isValidCapsJson: false,
          invalidCapsJsonReason: e.message,
          isValidatingCapsJson: true,
        };
      }

    case SET_RAW_DESIRED_CAPS:
      let isValidCapsJson = true;
      let invalidCapsJsonReason;
      if (state.isValidatingCapsJson) {
        try {
          JSON.parse(action.rawDesiredCaps);
        } catch (e) {
          isValidCapsJson = false;
          invalidCapsJsonReason = e.message;
        }
      }
      return {
        ...state,
        rawDesiredCaps: action.rawDesiredCaps,
        isValidCapsJson,
        invalidCapsJsonReason,
      };

    default:
      return {...state};
  }
}
