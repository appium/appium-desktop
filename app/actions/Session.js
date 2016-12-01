import { ipcRenderer } from 'electron';
import { push } from 'react-router-redux';
import settings from 'electron-settings';

export const NEW_SESSION_REQUESTED = 'NEW_SESSION_REQUESTED';
export const GET_DEFAULT_CAPS_REQUESTED = 'GET_DEFAULT_CAPS_REQUESTED';
export const GET_DEFAULT_CAPS_DONE = 'GET_DEFAULT_CAPS_DONE';
export const CHANGE_CAPABILITY = 'CHANGE_CAPABILITY';

const MOST_RECENT_DESIRED_CAPABILITIES = 'MOST_RECENT_DESIRED_CAPABILITIES';

function getDefaultDesiredCapabilities (desiredCapabilityConstraints) {
  let desiredCapabilities = {};

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

  return desiredCapabilities;
}

export function getDefaultCaps (desiredCapabilityConstraints) {
  return async (dispatch) => {
    dispatch({type: GET_DEFAULT_CAPS_REQUESTED, desiredCapabilityConstraints});

    // Get the most recently saved capabilities
    let desiredCapabilities = await settings.get(MOST_RECENT_DESIRED_CAPABILITIES);
    let defaultDesiredCapabilities = getDefaultDesiredCapabilities(desiredCapabilityConstraints);

    desiredCapabilities = {
      ...defaultDesiredCapabilities,
      ...desiredCapabilities,
    };

    dispatch({type: GET_DEFAULT_CAPS_DONE, desiredCapabilities});
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

    // Save these caps as the most recently used caps
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