import { ipcRenderer } from 'electron';

export const SET_SOURCE_AND_SCREENSHOT = 'SET_SOURCE';
export const QUIT_SESSION_REQUESTED = 'QUIT_SESSION_REQUESTED';
export const QUIT_SESSION_DONE = 'QUIT_SESSION_DONE';
export const SELECT_ELEMENT_BY_XPATH = 'SELECT_ELEMENT_BY_XPATH';
export const METHOD_CALL_REQUESTED = 'METHOD_CALL_REQUESTED';
export const METHOD_CALL_DONE = 'METHOD_CALL_DONE';
export const SET_INPUT_VALUE = 'SET_INPUT_VALUE';
export const SET_EXPANDED_XPATHS = 'SET_EXPANDED_XPATHS';

export function bindSessionDone () {
  return async (dispatch) => {
    ipcRenderer.on('appium-session-done', () => {
      ipcRenderer.removeAllListeners('appium-client-command-response');
      ipcRenderer.removeAllListeners('appium-client-command-response-error');
      dispatch({type: QUIT_SESSION_DONE});
    });

    ipcRenderer.on('appium-client-command-response', (evt, resp) => {
      const { source, screenshot } = resp;
      dispatch({type: SET_SOURCE_AND_SCREENSHOT, source, screenshot});
      dispatch({type: METHOD_CALL_DONE});
    });

    ipcRenderer.once('appium-client-command-response-error', (e) => {
      alert('Could not complete command');
      dispatch({type: METHOD_CALL_DONE});
    });
  };
}

export function selectElementByXPath (xpath) {
  return async (dispatch) => {
    dispatch({type: SELECT_ELEMENT_BY_XPATH, xpath});
  };
}

/**
 * Send a command to 'wd'. 
 */
export function applyClientMethod (params) {
  return async (dispatch) => {
    ipcRenderer.send('appium-client-command-request', params);
    dispatch({type: METHOD_CALL_REQUESTED});
  };
}

export function quitSession () {
  return async (dispatch) => {
    dispatch({type: QUIT_SESSION_REQUESTED});
    ipcRenderer.send('appium-client-command-request', {methodName: 'quit'});
  };
}

export function setInputValue (name, value) {
  return async (dispatch) => {
    dispatch({type: SET_INPUT_VALUE, name, value});
  };
}

export function setExpandedXPaths (xpaths) {
  return async (dispatch) => {
    dispatch({type: SET_EXPANDED_XPATHS, xpaths});
  };
}