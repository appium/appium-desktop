// import { ipcRenderer } from 'electron';

export const ACTION = 'ACTION';

export function doAction (action) {
  return (dispatch) => {
    dispatch({type: ACTION});
  };
}