import { NEW_SESSION_REQUESTED } from '../actions/Session';

const initialState = {

};

export default function session (state=initialState, action) {
  switch (action.type) {
    case NEW_SESSION_REQUESTED:
      return {
        ...state,
        newSession: action.desiredCapabilities
      };
    default:
      return {...state};
  }
}