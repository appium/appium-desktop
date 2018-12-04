import { SET_UPDATE_STATE } from '../actions/Updater';

const INITIAL_STATE = {};

export default function session (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_UPDATE_STATE:
      return {...action.updateState};
    default:
      return {...state};
  }
}
