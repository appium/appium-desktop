import { ipcRenderer } from 'electron';
import { push } from 'react-router-redux';

export const NEW_SESSION_REQUESTED = 'newSessionRequested';

export function newSessionRequested (desiredCapabilities) {
  return {type: NEW_SESSION_REQUESTED, desiredCapabilities};
}

export function newSession (desiredCapabilities) {
  return (dispatch) => {
    dispatch(newSessionRequested(desiredCapabilities));

    ipcRenderer.once('appium-new-session-ready', (event, message) => {
      alert('Successfully started session');
    });

    ipcRenderer.once('appium-new-session-failed', (event, message) => {
      ipcRenderer.removeAllListeners('appium-log-line');
      alert('Error starting session');
    });

    ipcRenderer.send('appium-create-new-session', desiredCapabilities, () => {
      dispatch(push('/inspector'));
    });
  };
}