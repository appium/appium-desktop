import { NEW_SESSION_REQUESTED, GET_SAVED_CAPABILITIES_REQUEST, GET_SAVED_CAPABILITIES_DONE,
        CHANGE_CAPABILITY } from '../actions/Session';

const initialState = {

};

export default function session (state=initialState, action) {
  switch (action.type) {
    case NEW_SESSION_REQUESTED:
      return {
        ...state,
        newSession: action.desiredCapabilities
      };
    case GET_SAVED_CAPABILITIES_REQUEST:
      return {
        ...state,
        gettingSavedDefaultCapabilities: true,
      };
    case GET_SAVED_CAPABILITIES_DONE: 
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
      console.log(nextState, 'nextState');
      return nextState;
    default:
      return {...state};
  }
}