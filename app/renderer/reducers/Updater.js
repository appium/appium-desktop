
import { UPDATE_INFO, DOWNLOAD_UPDATE_REQUESTED, DOWNLOAD_PROGRESSED, DOWNLOAD_COMPLETED } from '../actions/Updater';

const INITIAL_STATE = {
  downloadProgress: {},
  isDownloading: false,
  isDownloaded: false,
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
        isDownloading: true,
      };

    case DOWNLOAD_PROGRESSED:
      return {
        ...state,
        downloadProgress: action.downloadProgress,
      };

    case DOWNLOAD_COMPLETED:
      return {
        ...state,
        isDownloading: false,
        isDownloaded: true,
        downloadProgress: {},
      };

    default:
      return {...state};
  }
}
