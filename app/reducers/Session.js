import UPDATE_DESIRED_CAPABILITIES from '../actions/Session';

const initialState = {

};

export default function session (state=initialState, action) {
  let nextState;
  switch (action.type) {
    case UPDATE_DESIRED_CAPABILITIES:
      nextState = {
        ...state,
      };
      nextState.desiredCapabilities = nextState.desiredCapabilities || {};
      nextState.desiredCapabilities[action.key] = action.value;
      return nextState; 
    default:
      return {...state};
  }
}