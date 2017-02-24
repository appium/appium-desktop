import { FOUND_UPDATE, FOUND_NO_UPDATE, UPDATE_ERROR, DOWNLOAD_UPDATE_REQUESTED, DOWNLOAD_PROGRESSED, DOWNLOAD_COMPLETED } from '../actions/Updater';

const INITIAL_STATE = {
  isCheckingForUpdate: true,
  hasFoundNoUpdate: false,
  hasFoundUpdate: false,
  hasDownloadStarted: false,
  hasDownloadFinished: false,
  hasUpdateError: false,
  downloadProgress: {},
  updateInfo: {},
};

export default function session (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FOUND_UPDATE:
      return {
        ...state,
        isCheckingForUpdate: false,
        hasFoundUpdate: true,
        updateInfo: action.updateInfo,
      };

    case FOUND_NO_UPDATE:
      return {
        ...state,
        isCheckingForUpdate: false,
        hasFoundNoUpdate: true
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
