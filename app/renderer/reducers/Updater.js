// import {omit} from 'lodash';

import { UPDATE_INFO } from '../actions/Updater';

export default function session (state = {}, action) {
  switch (action.type) {
    case UPDATE_INFO:
      return {
        ...state,
        updateInfo: action.updateInfo,
      };

    default:
      return {...state};
  }
}
