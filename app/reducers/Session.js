import { NEW_SESSION_REQUESTED, GET_DEFAULT_CAPS_REQUESTED, GET_DEFAULT_CAPS_DONE,
        CHANGE_CAPABILITY } from '../actions/Session';

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
        gettingSavedDefaultCapabilities: true,
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
    default:
      return {...state};
  }
}