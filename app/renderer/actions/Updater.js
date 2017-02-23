import { ipcRenderer } from 'electron';

export const UPDATE_INFO = 'UPDATE_INFO';
export const DOWNLOAD_UPDATE_REQUESTED = 'DOWNLOAD_UPDATE_REQUESTED';


export function foundAvailableUpdate (updateInfo) {
  return (dispatch) => {
    dispatch({type: UPDATE_INFO, updateInfo});
  };
}

export function requestUpdateDownload () {
  return (dispatch) => {
    ipcRenderer.send('update-download-request');
    dispatch({type: DOWNLOAD_UPDATE_REQUESTED});
  };
}