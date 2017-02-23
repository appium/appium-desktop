// import {omit} from 'lodash';

import { UPDATE_INFO, DOWNLOAD_UPDATE_REQUESTED } from '../actions/Updater';

export default function session (state = {}, action) {
  switch (action.type) {
    case UPDATE_INFO:
      return {
        ...state,
        updateInfo: action.updateInfo,
      };

    case DOWNLOAD_UPDATE_REQUESTED:
      return {
        ...state,
        isDownloading: true,
      };

    default:
      return {...state};
  }
}
