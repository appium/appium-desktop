import { NEW_SESSION_REQUESTED, GET_DEFAULT_CAPS_REQUESTED, GET_DEFAULT_CAPS_DONE,
        CHANGE_CAPABILITY, GET_RECENT_SESSIONS_REQUESTED, GET_RECENT_SESSIONS_DONE, SET_DESIRED_CAPABILITIES,
        SAVE_SESSION_REQUESTED, SAVE_SESSION_DONE, GET_SAVED_SESSIONS_REQUESTED, GET_SAVED_SESSIONS_DONE } from '../actions/Session';

export default function session (state={}, action) {
  switch (action.type) {
    case NEW_SESSION_REQUESTED:
      return {
        ...state,
        newSession: action.desiredCapabilities
      };
    case GET_DEFAULT_CAPS_REQUESTED:
      return {
        ...state,
        getDefaultCapsRequested: true,
      };
    case GET_DEFAULT_CAPS_DONE: 
      return {
        ...state,
        desiredCapabilities: action.desiredCapabilities,
      };
    case CHANGE_CAPABILITY:
      var dcaps = state.desiredCapabilities;
      var nextState = {
        ...state
      };
      nextState.desiredCapabilities = {
        ...dcaps
      };
      nextState.desiredCapabilities[action.key] = action.value;
      return nextState;
    case SAVE_SESSION_REQUESTED:
      return {
        ...state,
        saveSessionRequested: true
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
    case SET_DESIRED_CAPABILITIES:
      return {
        ...state,
        desiredCapabilities: action.desiredCapabilities
      };
    case GET_RECENT_SESSIONS_REQUESTED:
      return {
        ...state,
        getRecentSessionsRequested: true
      };
    case GET_RECENT_SESSIONS_DONE:
      return {
        ...state,
        recentSessions: action.recentSessions
      };
    default:
      return {...state};
  }
}