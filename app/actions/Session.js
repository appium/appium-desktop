import { ipcRenderer } from 'electron';
import { push } from 'react-router-redux';
import settings from 'electron-settings';

export const NEW_SESSION_REQUESTED = 'NEW_SESSION_REQUESTED';
export const GET_SAVED_CAPABILITIES_REQUEST = 'GET_SAVED_CAPABILITIES_REQUEST';
export const GET_SAVED_CAPABILITIES_DONE = 'GET_SAVED_CAPABILITIES_DONE';
export const CHANGE_CAPABILITY = 'CHANGE_CAPABILITY';

const MOST_RECENT_DESIRED_CAPABILITIES = 'mostRecentDesiredCapabilities';

export function requestedSavedCapabilities (desiredCapabilityConstraints) {
  return async (dispatch) => {
    dispatch({type: GET_SAVED_CAPABILITIES_REQUEST, desiredCapabilityConstraints});

    // Get the most recently saved capabilities
    let desiredCapabilities = await settings.get(MOST_RECENT_DESIRED_CAPABILITIES);

    // If there are no saved ones use the defaults
    if (!desiredCapabilities) {
      desiredCapabilities = {};
      // Set default values for capabilities
      Object.keys(desiredCapabilityConstraints).map((key) => {
        let cap = desiredCapabilityConstraints[key];

        // If it's a select, choose the first by default
        if (cap.inclusionCaseInsensitive || cap.inclusion) {
          desiredCapabilities[key] = (cap.inclusionCaseInsensitive || cap.inclusion)[0];
        } else if (cap.isBoolean) {
          desiredCapabilities[key] = false;
        } else if (cap.isNumber) {
          desiredCapabilities[key] = null;
        } else {
          desiredCapabilities[key] = '';
        }
      });
    }
    dispatch({type: GET_SAVED_CAPABILITIES_DONE, desiredCapabilities});
  };
}

export function changeCapability (key, value) {
  return async (dispatch) => {
    dispatch({type: CHANGE_CAPABILITY, key, value});
  };
}

export function newSession (desiredCapabilities) {
  return async (dispatch) => {
    dispatch({type: NEW_SESSION_REQUESTED, desiredCapabilities});
    await settings.set(MOST_RECENT_DESIRED_CAPABILITIES, desiredCapabilities);

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