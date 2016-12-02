import { NEW_SESSION_REQUESTED, NEW_SESSION_BEGAN, NEW_SESSION_DONE,
        SAVE_SESSION_REQUESTED, SAVE_SESSION_DONE, GET_SAVED_SESSIONS_REQUESTED, GET_SAVED_SESSIONS_DONE,
        SET_CAPABILITY_PARAM, ADD_CAPABILITY, REMOVE_CAPABILITY, SET_CAPS,
        SWITCHED_TABS } from '../actions/Session';

let caps;

// Make sure there's always at least one cap
const INITIAL_STATE = {
  savedSessions: [],
  tabKey: 'new',
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
      caps = state.caps || [];
      caps = [...caps];
      caps.push({
        type: 'text',
      });
      return {
        ...state,
        caps,
      };
    case REMOVE_CAPABILITY:
      caps = state.caps || [];
      if (caps.length === 1) {
        return {...state};
      }
      caps = [...caps];
      caps.splice(action.index, 1);
      return {
        ...state,
        caps,
      };
    case SET_CAPABILITY_PARAM:
      caps = state.caps || [];
      caps = [...caps];
      caps[action.index][action.name] = action.value;
      return {
        ...state,
        caps
      };
    case SET_CAPS:
      return {
        ...state,
        caps: action.caps
      };
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
    case SWITCHED_TABS:
      return {
        ...state,
        tabKey: action.key,
      };
    default:
      return {...state};
  }
}