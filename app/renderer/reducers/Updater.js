// import {omit} from 'lodash';

import { ACTION } from '../actions/Session';

export default function session (state = {}, action) {
  switch (action.type) {
    case ACTION:
      return {
        ...state,
        action,
      };

    default:
      return {...state};
  }
}
