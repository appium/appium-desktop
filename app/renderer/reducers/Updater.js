
import { UPDATE_INFO, UPDATE_ERROR, DOWNLOAD_UPDATE_REQUESTED, DOWNLOAD_PROGRESSED, DOWNLOAD_COMPLETED } from '../actions/Updater';

const INITIAL_STATE = {
  downloadProgress: {},
  hasDownloadStarted: false,
  hasDownloadFinished: false,
  hasUpdateError: false,
  updateInfo: {},
};

export default function session (state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_INFO:
      return {
        ...state,
        updateInfo: action.updateInfo,
      };

    case DOWNLOAD_UPDATE_REQUESTED:
      return {
        ...state,
        hasDownloadStarted: true,
      };

    case DOWNLOAD_PROGRESSED:
      return {
        ...state,
        downloadProgress: action.downloadProgress,
      };

    case DOWNLOAD_COMPLETED:
      return {
        ...state,
        hasDownloadFinished: true,
        downloadProgress: {},
      };
    
    case UPDATE_ERROR:
      return {
        ...state,
        hasUpdateError: true,
      };

    default:
      return {...state};
  }
}
