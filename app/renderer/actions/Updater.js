import { ipcRenderer } from 'electron';

export const FOUND_UPDATE = 'FOUND_UPDATE';
export const FOUND_NO_UPDATE = 'FOUND_NO_UPDATE';
export const UPDATE_ERROR = 'UPDATE_ERROR';
export const DOWNLOAD_UPDATE_REQUESTED = 'DOWNLOAD_UPDATE_REQUESTED';
export const DOWNLOAD_PROGRESSED = 'DOWNLOAD_PROGRESSED';
export const DOWNLOAD_COMPLETED = 'DOWNLOAD_COMPLETED';


export function foundAvailableUpdate (updateInfo) {
  return (dispatch) => {
    dispatch({type: FOUND_UPDATE, updateInfo});
  };
}

export function foundNoUpdate () {
  return (dispatch) => {
    dispatch({type: FOUND_NO_UPDATE});
  };
};

export function requestUpdateDownload () {
  return (dispatch) => {
    ipcRenderer.send('update-download-request');
    dispatch({type: DOWNLOAD_UPDATE_REQUESTED});
  };
}

export function downloadProgressed (downloadProgress) {
  return (dispatch) => {
    dispatch({type: DOWNLOAD_PROGRESSED, downloadProgress});
  };
}

export function downloadCompleted (downloadProgress) {
  return (dispatch) => {
    dispatch({type: DOWNLOAD_COMPLETED, downloadProgress});
  };
}

export function updateError () {
  return (dispatch) => {
    dispatch({type: UPDATE_ERROR});
  };
}